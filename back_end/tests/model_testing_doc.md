# Documentación Técnica: Pruebas Unitarias de Modelos

Este documento detalla la justificación y el funcionamiento de las pruebas unitarias realizadas sobre la capa de modelos (Sequelize) del Sistema Bancario.

## Metodología
Cada modelo cuenta con al menos 3 casos de prueba:
1.  **Happy Path**: Verificación de creación exitosa con datos válidos.
2.  **Validación de Campos**: Garantiza que los campos obligatorios (`allowNull: false`) lancen errores si se omiten.
3.  **Lógica o Restricción**: Pruebas de unicidad, rangos numéricos o formatos específicos.

---

## 1. Modelo: Usuario
### Test 1: Happy Path
*   **¿Por qué?:** Validar que la base de datos acepta usuarios con estructura correcta.
*   **Funcionamiento:** Envía un objeto con nombre, email único y hash. Espera que el objeto retornado tenga un `id` definido.

### Test 2: Validación de Campos
*   **¿Por qué?:** Evitar que se creen usuarios sin correo electrónico, lo cual rompería el sistema de autenticación.
*   **Funcionamiento:** Intenta crear un usuario sin `nombre_completo`. Espera un `SequelizeValidationError`.

### Test 3: Lógica (Email)
*   **¿Por qué?:** Garantizar la integridad de la comunicación y unicidad de cuentas.
*   **Funcionamiento:** Envía un email con formato inválido. Espera un error del validador `isEmail`.

---

## 2. Modelo: Cuenta
### Test 1: Happy Path
*   **¿Por qué?:** Asegurar que las cuentas se vinculen correctamente a usuarios, tipos y sucursales.
*   **Funcionamiento:** Payload con claves foráneas válidas y saldo inicial. Espera persistencia exitosa.

### Test 2: Validación de Campos
*   **¿Por qué?:** Una cuenta sin número de cuenta es inrastreable.
*   **Funcionamiento:** Omite `numero_cuenta`. Espera error de validación.

### Test 3: Lógica (Unicidad)
*   **¿Por qué?:** Evitar duplicidad de números de cuenta en el sistema bancario.
*   **Funcionamiento:** Intenta crear dos cuentas con el mismo número. Espera `SequelizeUniqueConstraintError`.

---

## 3. Modelo: Transaccion
### Test 1: Happy Path
*   **¿Por qué?:** Confirmar que el registro de movimientos financieros funciona.
*   **Funcionamiento:** Registro con monto, referencia y tipo. Espera creación correcta.

### Test 2: Validación de Campos
*   **¿Por qué?:** El monto es el dato más crítico de una transacción.
*   **Funcionamiento:** Envía monto nulo. Espera error de validación.

### Test 3: Lógica (Monto > 0)
*   **¿Por qué?:** Prevenir errores contables o fraudes mediante montos negativos o cero.
*   **Funcionamiento:** Intenta crear transacción con monto `-50`. Espera error de validación `min: 0.01`.

---

## 4. Modelo: Rol
### Test 1: Happy Path
*   **¿Por qué?:** Validar la creación de perfiles de acceso.
*   **Funcionamiento:** Nombre y descripción válidos. Espera `activa: true` por defecto.

### Test 2: Validación de Campos
*   **¿Por qué?:** Un rol sin nombre no puede ser asignado ni identificado.
*   **Funcionamiento:** Nombre nulo. Espera error de validación.

### Test 3: Lógica (Unicidad)
*   **¿Por qué?:** Los roles deben ser únicos para evitar ambigüedad en permisos.
*   **Funcionamiento:** Nombre duplicado. Espera `SequelizeUniqueConstraintError`.

---

## 5. Modelo: LogAcceso
### Test 1: Happy Path
*   **¿Por qué?:** Auditar los accesos al sistema es crítico para la seguridad bancaria.
*   **Funcionamiento:** Acción y IP válidas. Espera creación de registro de auditoría.

### Test 2: Validación de Campos
*   **¿Por qué?:** Un log debe indicar obligatoriamente si el acceso fue exitoso o no.
*   **Funcionamiento:** Campo `exitoso` nulo. Espera error de validación.

### Test 3: Lógica (Formato IP)
*   **¿Por qué?:** Asegurar que las direcciones IP registradas sean válidas para rastreo.
*   **Funcionamiento:** IP inválida (`abc.123`). Espera error de validación `isIP`.

---

## 6. Modelo: Moneda
### Test 1: Happy Path
*   **¿Por qué?:** Soporte multi-moneda para cuentas bancarias.
*   **Funcionamiento:** Código ISO (USD) y tasa de cambio. Espera éxito.

### Test 2: Validación de Campos
*   **¿Por qué?:** El código ISO es la clave de identificación de la moneda.
*   **Funcionamiento:** Código nulo. Espera error de validación.

### Test 3: Lógica (Tasa > 0)
*   **¿Por qué?:** Las tasas de cambio no pueden ser cero o negativas.
*   **Funcionamiento:** Tasa `0`. Espera error de validación `min`.

---

## 7. Modelo: Sesion
### Test 1: Happy Path
*   **¿Por qué?:** Controlar las sesiones activas de los usuarios.
*   **Funcionamiento:** Token y fecha de expiración futura. Espera éxito.

### Test 2: Validación de Campos
*   **¿Por qué?:** No se puede tener una sesión sin un token de referencia.
*   **Funcionamiento:** Token nulo. Espera error de validación.

### Test 3: Lógica (Fecha Futura)
*   **¿Por qué?:** Una sesión no puede expirar en el pasado al momento de crearse.
*   **Funcionamiento:** Fecha expirada. Espera error por validador personalizado `esFutura`.

---

## 8. Modelo: Sucursal
### Test 1: Happy Path
*   **¿Por qué?:** Identificar la ubicación física de las operaciones.
*   **Funcionamiento:** Nombre y dirección válidos. Espera estado `activa`.

### Test 2: Validación de Campos
*   **¿Por qué?:** El nombre es obligatorio para reportes y asignación de cuentas.
*   **Funcionamiento:** Nombre vacío. Espera error de validación.

### Test 3: Lógica (ENUM Estado)
*   **¿Por qué?:** Limitar los estados de la sucursal a valores controlados.
*   **Funcionamiento:** Estado `cerrada` (no en ENUM). Espera error de validación `isIn`.

---

## 9. Modelo: TasaInteres
### Test 1: Happy Path
*   **¿Por qué?:** Definir los rendimientos de las cuentas de ahorro.
*   **Funcionamiento:** Tasa y fechas válidas. Espera éxito.

### Test 2: Validación de Campos
*   **¿Por qué?:** La tasa debe estar dentro de rangos realistas (0-100%).
*   **Funcionamiento:** Tasa `105`. Espera error de validación `max: 100`.

### Test 3: Lógica (Fechas)
*   **¿Por qué?:** La vigencia de una tasa debe tener coherencia cronológica.
*   **Funcionamiento:** Fecha fin anterior a inicio. Espera error por validador `esPosteriorAInicio`.

---

## 10. Modelo: TipoCuenta
### Test 1: Happy Path
*   **¿Por qué?:** Categorizar los productos bancarios.
*   **Funcionamiento:** Nombre y tasa base válidos. Espera éxito.

### Test 2: Validación de Campos
*   **¿Por qué?:** La tasa base no puede ser negativa.
*   **Funcionamiento:** Tasa `-5`. Espera error de validación `min: 0`.

### Test 3: Lógica (Unicidad)
*   **¿Por qué?:** Evitar duplicidad de categorías de cuenta.
*   **Funcionamiento:** Nombre duplicado. Espera error de unicidad.

---

## 11. Modelo: TipoTransaccion
### Test 1: Happy Path
*   **¿Por qué?:** Identificar tipos de movimientos (Depósito, Retiro, etc).
*   **Funcionamiento:** Nombre válido. Espera `requiere_aprobacion` falso por defecto.

### Test 2: Validación de Campos
*   **¿Por qué?:** Obligar a dar un nombre descriptivo al tipo.
*   **Funcionamiento:** Nombre vacío. Espera error de validación.

### Test 3: Lógica (Unicidad)
*   **¿Por qué?:** Evitar confusión entre tipos de transacciones.
*   **Funcionamiento:** Nombre duplicado. Espera error de unicidad.
