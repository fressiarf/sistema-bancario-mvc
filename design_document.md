# Documento de Diseño y Análisis (Design Document)
## Sistema Bancario Integral (Full-Stack MVC)

### 1. Contexto General
Este sistema está diseñado para gestionar las operaciones esenciales de una entidad financiera moderna. Opera bajo cuatro principios fundamentales: integridad de datos, trazabilidad completa de operaciones, seguridad de acceso por capas y escalabilidad operativa. Todos los procesos críticos —autenticación, apertura de cuentas, movimientos de dinero y auditoría— están respaldados por una estructura relacional que garantiza consistencia en todo momento.

La plataforma se organiza en tres grandes dominios funcionales: 
1. **Gestión de identidad y seguridad** (quién accede y con qué privilegios).
2. **Gestión de productos financieros** (cuentas, tipos y monedas).
3. **Gestión de operaciones** (transacciones, aprobaciones y auditoría).

---

### 2. Arquitectura del Sistema

El sistema utiliza una arquitectura **Full-Stack Separada** para mayor escalabilidad:
*   **Backend**: API REST construida con Node.js y Express, utilizando Sequelize como ORM para la persistencia en MySQL.
*   **Frontend**: Aplicación Single Page (SPA) construida con React y Vite, enfocada en una experiencia de usuario fluida y segura.

---

### 3. Estructura de la Base de Datos y Entidades Principales

#### 3.1 Módulo de Seguridad y Acceso
* **Roles**: Define los niveles de privilegio del sistema (administrador, cajero, cliente). 
* **Usuarios**: Representa a toda persona que interactúa con el sistema. Incluye mecanismos antifraude (conteo de intentos fallidos, bloqueos temporales) y hash de contraseñas.
* **Sesiones**: Gestiona los accesos autenticados activos mediante tokens únicos, registrando IP y user-agent.
* **Logs_Acceso**: Registro de auditoría inmutable (append-only) del sistema. Registra cada acción relevante para auditorías de seguridad y cumplimiento regulatorio.

#### 3.2 Módulo de Catálogos Financieros
* **Sucursales**: Contiene la red de oficinas físicas o digitales de la entidad.
* **Monedas**: Permite que el sistema opere con múltiples divisas (USD, CRC, etc.).
* **Tipos_Cuenta**: Define los productos financieros disponibles (corriente, ahorros) y sus reglas de negocio.
* **Tasas_Interes**: Registra la evolución histórica de las tasas por tipo de cuenta.
* **Tipos_Transaccion**: Catálogo de operaciones (depósito, retiro, transferencia, etc.).

#### 3.3 Módulo Operativo
* **Cuentas**: La entidad central del sistema. Representa el producto financiero activo de un cliente, controlando el saldo real y disponible. 
* **Transacciones**: Registra cada movimiento de dinero. Soporta transferencias entre cuentas, depósitos y retiros. Incluye estados como pendiente, completada, rechazada y reversada.

---

### 4. Relaciones entre Entidades (Integridad Referencial)

El diseño de la base de datos se rige por fuertes restricciones de claves foráneas:
* **Usuarios** (1) -> (N) **Cuentas**: Un usuario puede poseer múltiples cuentas bancarias.
* **Roles** (1) -> (N) **Usuarios**: Varios usuarios comparten el mismo nivel de acceso.
* **Tipos_Cuenta**, **Monedas**, **Sucursales** (1) -> (N) **Cuentas**: Clasificación jerárquica de productos financieros.
* **Cuentas** (1) -> (N) **Transacciones**: Relación de origen y destino para movimientos financieros.
* **Transacciones** (1) -> (N) **Transacciones**: Relación auto-referencial para gestionar reversiones.

---

### 5. Criterios de Integridad y Seguridad (Backend)

*   **Validación de Datos**: Implementada a nivel de modelos de Sequelize y middlewares de ruta.
*   **Seguridad JWT**: Autenticación basada en tokens con expiración y firma secreta.
*   **Cifrado Bcrypt**: Hash de contraseñas con factor de costo 10.
*   **Control de Acceso (RBAC)**: Middlewares que restringen el acceso a rutas según el rol extraído del token.
*   **Protección de Métodos**: Restricción del método `DELETE` exclusivamente para administradores.
*   **Transacciones Atómicas**: Uso de transacciones SQL para asegurar que las operaciones financieras se completen íntegramente o se reviertan totalmente en caso de error.

---

### 6. Arquitectura de Pruebas (Test Automation)

El sistema implementa una infraestructura de pruebas robusta basada en Jest y Supertest:

*   **Aislamiento de la Aplicación**: Separación de la lógica de Express (`index.js`) del punto de entrada del servidor (`server.js`). Esto permite a Jest instanciar la aplicación en memoria para pruebas sin ocupar puertos de red reales.
*   **Base de Datos de Pruebas**: Uso de un entorno de base de datos dedicado (`test`) para evitar la contaminación de datos de desarrollo o producción.
*   **Pruebas de Integración**: Simulación de peticiones HTTP completas para validar el flujo desde la ruta hasta la base de datos, incluyendo la ejecución de middlewares.
*   **Limpieza Automatizada**: Hooks de ciclo de vida (`beforeAll`, `afterAll`) que preparan el escenario y limpian la base de datos después de cada suite de pruebas.

---

### 6. Arquitectura del Frontend (React)

El frontend está estructurado para consumir la API de manera eficiente:
*   **Servicios**: Capa de comunicación dedicada para realizar peticiones HTTP (Fetch/Axios) al backend.
*   **Hooks Personalizados**: Gestión de estado global para la sesión del usuario y datos financieros.
*   **Componentes Reutilizables**: Interfaz modular basada en componentes atómicos para consistencia visual.
*   **Protección de Rutas**: Sistema de navegación que redirige a los usuarios según su estado de autenticación y rol.

---

### 7. Auditoría y Control
Cada intento de login y cada transacción financiera genera un rastro digital inmutable en las tablas de `logs_acceso` y `transacciones`, permitiendo reconstruir cualquier evento en el sistema para fines de cumplimiento o resolución de errores.

