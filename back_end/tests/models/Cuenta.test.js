const { sequelize, Cuenta, Usuario, Rol, TipoCuenta, Moneda, Sucursal } = require('../../models');

beforeAll(async () => {
  await sequelize.sync();
});

afterAll(async () => {
  await sequelize.close();
});

describe('Modelo Cuenta', () => {
  let setupData = {};

  beforeAll(async () => {
    const [rol] = await Rol.findOrCreate({ where: { nombre: 'Cliente' } });
    const [tipo] = await TipoCuenta.findOrCreate({ where: { nombre: 'Ahorro' } });
    const [moneda] = await Moneda.findOrCreate({ where: { codigo: 'USD' }, defaults: { nombre: 'Dolar', simbolo: '$', tasa_cambio_usd: 1 } });
    const [sucursal] = await Sucursal.findOrCreate({ where: { nombre: 'Central' } });
    
    const usuario = await Usuario.create({
      nombre_completo: 'Cuenta Owner',
      email: `owner_${Date.now()}@test.com`,
      rol_id: rol.id,
      contrasenia_hash: 'hash'
    });

    setupData = { usuarioId: usuario.id, tipoId: tipo.id, monedaId: moneda.id, sucursalId: sucursal.id };
  });

  test('Happy Path: Debería crear una cuenta válida', async () => {
    const cuenta = await Cuenta.create({
      numero_cuenta: `ACC-${Date.now()}`,
      usuario_id: setupData.usuarioId,
      tipo_cuenta_id: setupData.tipoId,
      moneda_id: setupData.monedaId,
      sucursal_id: setupData.sucursalId,
      saldo: 500,
      saldo_disponible: 500,
      fecha_apertura: '2023-01-01'
    });
    expect(cuenta.id).toBeDefined();
    expect(parseFloat(cuenta.saldo)).toBe(500);
  });

  test('Validación de Campos: Debería fallar si el número de cuenta es nulo', async () => {
    try {
      await Cuenta.create({
        usuario_id: setupData.usuarioId,
        tipo_cuenta_id: setupData.tipoId
      });
      fail('Debería haber lanzado un error de validación');
    } catch (error) {
      expect(error.name).toBe('SequelizeValidationError');
    }
  });

  test('Lógica/Restricción: Debería fallar si el número de cuenta ya existe', async () => {
    const num = `DUP-${Date.now()}`;
    await Cuenta.create({
      numero_cuenta: num,
      usuario_id: setupData.usuarioId,
      tipo_cuenta_id: setupData.tipoId,
      moneda_id: setupData.monedaId,
      sucursal_id: setupData.sucursalId,
      fecha_apertura: '2023-01-01'
    });

    try {
      await Cuenta.create({
        numero_cuenta: num,
        usuario_id: setupData.usuarioId,
        tipo_cuenta_id: setupData.tipoId,
        moneda_id: setupData.monedaId,
        sucursal_id: setupData.sucursalId,
        fecha_apertura: '2023-01-01'
      });
      fail('Debería haber lanzado un error de duplicidad');
    } catch (error) {
      expect(error.name).toBe('SequelizeUniqueConstraintError');
    }
  });
});
