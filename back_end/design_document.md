# Documento de Diseño y Análisis (Design Document)
## Sistema Backend Bancario

### 1. Contexto General
Este sistema backend está diseñado para gestionar las operaciones esenciales de una entidad financiera moderna. Opera bajo cuatro principios fundamentales: integridad de datos, trazabilidad completa de operaciones, seguridad de acceso por capas y escalabilidad operativa. Todos los procesos críticos —autenticación, apertura de cuentas, movimientos de dinero y auditoría— están respaldados por una estructura relacional que garantiza consistencia en todo momento.

La plataforma se organiza en tres grandes dominios funcionales: 
1. **Gestión de identidad y seguridad** (quién accede y con qué privilegios).
2. **Gestión de productos financieros** (cuentas, tipos y monedas).
3. **Gestión de operaciones** (transacciones, aprobaciones y auditoría).

---

### 2. Estructura de la Base de Datos y Entidades Principales

#### 2.1 Módulo de Seguridad y Acceso
* **Roles**: Define los niveles de privilegio del sistema (clientes, cajeros, supervisores y administradores). 
* **Usuarios**: Representa a toda persona que interactúa con el sistema. Incluye mecanismos antifraude (conteo de intentos fallidos, bloqueos temporales) y hash de contraseñas.
* **Sesiones**: Gestiona los accesos autenticados activos mediante tokens únicos, registrando IP y user-agent. Soporta múltiples sesiones simultáneas.
* **Logs_Acceso**: Registro de auditoría inmutable (append-only) del sistema. Registra cada acción relevante para auditorías de seguridad y cumplimiento regulatorio.

#### 2.2 Módulo de Catálogos Financieros
* **Sucursales**: Contiene la red de oficinas físicas o digitales de la entidad a las que se asignan las cuentas.
* **Monedas**: Permite que el sistema opere con múltiples divisas simultáneamente, manejando una tasa de cambio de referencia.
* **Tipos_Cuenta**: Define los productos financieros disponibles (corriente, ahorros, etc.) y si permiten o no sobregiro.
* **Tasas_Interes**: Registra la evolución histórica de las tasas por tipo de cuenta, permitiendo calcular intereses correctamente para cualquier período.
* **Tipos_Transaccion**: Catálogo de operaciones (depósito, retiro, transferencia, etc.) y si requieren revisión manual por riesgo operativo.

#### 2.3 Módulo Operativo
* **Cuentas**: La entidad central del sistema. Representa el producto financiero activo de un cliente, controlando el saldo y el saldo disponible. 
* **Transacciones**: Registra cada movimiento de dinero. Puede tener cuenta de origen, cuenta de destino o ambas. Registra el monto neto y la comisión. Su ciclo de vida incluye estados como pendiente, completada, rechazada y reversada.

---

### 3. Relaciones entre Entidades (Integridad Referencial)

El diseño de la base de datos se rige por fuertes restricciones de claves foráneas. Las relaciones principales incluyen:

* **Usuarios** (1) -> (N) **Cuentas**: Un usuario puede poseer múltiples cuentas bancarias.
* **Roles** (1) -> (N) **Usuarios**: Varios usuarios comparten el mismo nivel de acceso.
* **Usuarios** (1) -> (N) **Sesiones** / **Logs_Acceso**: Un usuario puede tener múltiples inicios de sesión y registros de auditoría.
* **Tipos_Cuenta**, **Monedas**, **Sucursales** (1) -> (N) **Cuentas**: Cada cuenta se clasifica bajo un producto, en una moneda específica, y en una sucursal dada.
* **Cuentas** (1) -> (N) **Transacciones**: Una cuenta puede originar múltiples transacciones (cuenta_origen) o ser el destino de múltiples transacciones (cuenta_destino).
* **Tipos_Transaccion** (1) -> (N) **Transacciones**: Toda transacción pertenece a un tipo operativo definido.
* **Usuarios** (1) -> (N) **Transacciones**: Un usuario supervisor puede autorizar o aprobar múltiples transacciones (campo `aprobado_por`).
* **Transacciones** (1) -> (N) **Transacciones**: Relación auto-referencial (`transaccion_origen_id`) para gestionar el flujo de reversiones bancarias atadas a operaciones previas.

---

### 4. Criterios de Integridad Aplicados en Modelos (Sequelize)
* **onUpdate: 'CASCADE' y onDelete: 'RESTRICT'**: Se aplicó en todas las claves foráneas para evitar la eliminación de registros padre que tengan hijos activos.
* **Borrado Lógico**: La eliminación se maneja mediante campos `activa` (boolean) o `estado` (enum), nunca se ejecuta un `DELETE` físico.
* **Exclusión de Datos Sensibles**: El modelo `Usuario` excluye por defecto el `contrasenia_hash` en las consultas para evitar fugas de información en endpoints futuros.
* **Campos de Montos Precisos**: Todos los saldos y montos utilizan el tipo `DECIMAL(15, 2)` para evitar problemas de coma flotante.
* **Timestamps Obligatorios**: `createdAt` y `updatedAt` gestionados automáticamente en todas las tablas para trazabilidad cronológica.
