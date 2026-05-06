comportate como un programador experto en nodejs y express, con mas de 20 años de experiencia. te vas a encargar de desarrollar un sistema bancario, con base de datos mysql, siguiendo el patron de diseño mvc.

Que manejes las mejores practicas de programacion y de servidores seguros. Siempre optimiza el codigo y que sea facil de entender, documentado y limpio.


### Estructura del proyecto:
```
/back_end
  /controllers
  /db
  /migrations
  /models
  /routes
```

### Logica de negocio:

Sistema Backend Bancario — Contexto y Lógica de Negocio
Contexto General
Este sistema backend está diseñado para gestionar las operaciones esenciales de una entidad financiera moderna. Opera bajo cuatro principios fundamentales: integridad de datos, trazabilidad completa de operaciones, seguridad de acceso por capas y escalabilidad operativa. Todos los procesos críticos —autenticación, apertura de cuentas, movimientos de dinero y auditoría— están respaldados por una estructura relacional que garantiza consistencia en todo momento.
La plataforma se organiza en tres grandes dominios funcionales: gestión de identidad y seguridad (quién accede y con qué privilegios), gestión de productos financieros (cuentas, tipos y monedas), y gestión de operaciones (transacciones, aprobaciones y auditoría).

Módulo de Seguridad y Acceso
ROLES define los niveles de privilegio del sistema. Un rol puede asignarse a múltiples usuarios, permitiendo diferenciar entre clientes, cajeros, supervisores y administradores. Los roles pueden desactivarse sin eliminarse mediante el campo activa.
USUARIOS representa a toda persona que interactúa con el sistema. Las contraseñas nunca se almacenan en texto plano, solo su hash (contrasena_hash). El sistema incluye mecanismos antifraude: intentos_fallidos cuenta los accesos incorrectos y bloqueado_hasta impide el acceso temporal tras superar el límite. El campo estado maneja el ciclo de vida del usuario mediante ENUM (activo, bloqueado, suspendido).
SESIONES gestiona los accesos autenticados activos. Cada inicio de sesión genera un token único con fecha de expiración, lo que permite invalidar sesiones de forma remota sin intervención del usuario. Soporta múltiples sesiones simultáneas por usuario (multi-dispositivo), registrando también la IP y el user-agent de cada acceso.
LOGS_ACCESO es el registro de auditoría inmutable del sistema. A diferencia de SESIONES, esta tabla es append-only: nunca se actualiza ni elimina. Registra cada acción relevante con su IP, descripción y marca de tiempo exacta. Es fundamental para auditorías de seguridad y cumplimiento regulatorio.

Módulo de Catálogos Financieros
SUCURSALES contiene la red de oficinas físicas o digitales de la entidad. Toda cuenta bancaria debe estar asignada a una sucursal, lo que permite la segmentación geográfica de operaciones y la asignación de responsabilidades por región.
MONEDAS permite que el sistema opere con múltiples divisas simultáneamente. Cada cuenta tiene una moneda asociada y el campo tasa_cambio_usd permite realizar conversiones cuando una transacción involucra cuentas denominadas en divisas distintas.
TIPOS_CUENTA define los productos financieros disponibles: cuenta corriente, ahorros, empresarial, etc. Cada tipo tiene condiciones propias (permite sobregiro, tasa base). El historial de variaciones de tasas no vive aquí sino en la tabla especializada TASAS_INTERES.
TASAS_INTERES registra la evolución histórica de las tasas por tipo de cuenta, con campos fecha_ini y fecha_fin. Esto es obligatorio para el cumplimiento regulatorio: las tasas cambian en el tiempo y el sistema debe poder calcular intereses correctamente para cualquier período histórico.
TIPOS_TRANSACCION es el catálogo de operaciones disponibles: depósito, retiro, transferencia, pago de servicio, etc. El campo requiere_aprobacion determina si una operación de ese tipo debe pasar por revisión manual antes de ejecutarse, lo cual es crítico para transacciones de alto valor o riesgo.

Módulo Operativo
CUENTAS es la entidad central del sistema. Representa el producto financiero activo de un cliente. Cada cuenta tiene un numero_cuenta único visible para el cliente, un saldo y un saldo_disponible (que puede diferir si existen fondos retenidos), y un estado mediante ENUM (activa, inactiva, bloqueada, cerrada). Se relaciona simultáneamente con USUARIOS (propietario), TIPOS_CUENTA (clasificación), MONEDAS (divisa), SUCURSALES (asignación) y TRANSACCIONES (origen y destino de movimientos).
TRANSACCIONES es la tabla de mayor criticidad operativa. Registra cada movimiento de dinero. Dependiendo del tipo de operación, puede tener cuenta de origen, cuenta de destino o ambas: un retiro en cajero solo tiene cuenta_origen_id; un depósito en ventanilla solo tiene cuenta_destino_id; una transferencia tiene ambas. El campo monto_total representa el monto bruto más la comisión aplicada. El campo referencia es único y sirve para trazabilidad y conciliación bancaria. El ciclo de vida de cada transacción se controla mediante estado (pendiente, completada, rechazada, reversada). Las transacciones que requieren aprobación registran el empleado autorizante en aprobado_por y la marca temporal en fecha_aprobacion.

Flujos de Negocio Principales
Autenticación: el usuario envía credenciales, el sistema verifica el hash, incrementa intentos_fallidos si falla o crea una sesión activa en SESIONES si tiene éxito. El evento queda registrado en LOGS_ACCESO en ambos casos.
Apertura de cuenta: un empleado autorizado crea o selecciona al cliente en USUARIOS, elige el TIPO_CUENTA, MONEDA y SUCURSAL, y el sistema genera el numero_cuenta único con estado activa y la fecha_apertura correspondiente.
Transferencia: el sistema valida que la cuenta origen esté activa y tenga saldo disponible suficiente, y que la cuenta destino esté activa. Si el tipo de transacción requiere aprobación, queda en estado pendiente hasta que un supervisor la autoriza. Si no requiere aprobación, se ejecuta inmediatamente: se descuenta el monto_total de la cuenta origen y se acredita el monto en la cuenta destino.
Reversión: se crea una nueva transacción de tipo reversión que referencia la operación original. Los saldos se ajustan de forma inversa y la transacción original cambia su estado a reversada.

Criterios de Integridad
Todas las claves foráneas usan ON DELETE RESTRICT para evitar la eliminación de registros padre que tengan hijos activos. No se puede eliminar una cuenta con transacciones asociadas, ni un usuario con cuentas abiertas. El borrado lógico se implementa siempre mediante campos estado o activa, nunca mediante DELETE físico. Todos los modelos Sequelize deben tener timestamps: true, lo que gestiona automáticamente los campos createdAt y updatedAt en cada tabla.