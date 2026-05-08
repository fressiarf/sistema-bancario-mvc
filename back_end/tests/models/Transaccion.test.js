const { sequelize, Transaccion, TipoTransaccion, Cuenta, Usuario, Rol, TipoCuenta, Moneda, Sucursal } = require('../../models');

beforeAll(async () => {
  await sequelize.sync();
});

afterAll(async () => {
  await sequelize.close();
});

describe('Modelo Transaccion', () => {
  let setupData = {};

  beforeAll(async () => {
    const [rol] = await Rol.findOrCreate({ where: { nombre: 'Cajero' } });
    const [tipoT] = await TipoTransaccion.findOrCreate({ where: { nombre: 'Deposito' } });
    const [tipoC] = await TipoCuenta.findOrCreate({ where: { nombre: 'Corriente' } });
    const [moneda] = await Moneda.findOrCreate({ where: { codigo: 'COR' }, defaults: { nombre: 'Cordoba', simbolo: 'C$', tasa_cambio_usd: 36 } });
    const [sucursal] = await Sucursal.findOrCreate({ where: { nombre: 'Norte' } });
    
    const usuario = await Usuario.create({
      nombre_completo: 'Cajero User',
      email: `cajero_${Date.now()}@test.com`,
      rol_id: rol.id,
      contrasenia_hash: 'hash'
    });

    const cuenta = await Cuenta.create({
      numero_cuenta: `TX-ACC-${Date.now()}`,
      usuario_id: usuario.id,
      tipo_cuenta_id: tipoC.id,
      moneda_id: moneda.id,
      sucursal_id: sucursal.id,
      fecha_apertura: '2023-01-01'
    });

    setupData = { tipoTransaccionId: tipoT.id, cuentaId: cuenta.id };
  });

  test('Happy Path: Debería crear una transacción válida', async () => {
    const tx = await Transaccion.create({
      tipo_transaccion_id: setupData.tipoTransaccionId,
      cuenta_destino_id: setupData.cuentaId,
      monto: 100.00,
      monto_total: 100.00,
      referencia: `REF-${Date.now()}`,
      estado: 'completada'
    });
    expect(tx.id).toBeDefined();
    expect(parseFloat(tx.monto)).toBe(100.00);
  });

  test('Validación de Campos: Debería fallar si el monto es nulo', async () => {
    try {
      await Transaccion.create({
        tipo_transaccion_id: setupData.tipoTransaccionId,
        referencia: 'REF-NULL'
      });
      fail('Debería haber lanzado un error de validación');
    } catch (error) {
      expect(error.name).toBe('SequelizeValidationError');
    }
  });

  test('Lógica/Restricción: El monto debe ser mayor a cero', async () => {
    try {
      await Transaccion.create({
        tipo_transaccion_id: setupData.tipoTransaccionId,
        cuenta_destino_id: setupData.cuentaId,
        monto: 0,
        monto_total: 0,
        referencia: `REF-ZERO-${Date.now()}`
      });
      fail('Debería haber lanzado un error por monto <= 0');
    } catch (error) {
      expect(error.errors[0].message).toMatch(/monto debe ser mayor a 0/);
    }
  });
});
