const request = require('supertest');
const app = require('../../index');
const { sequelize, Usuario, Rol, Cuenta, TipoCuenta, Moneda, TipoTransaccion, Sucursal, Sesion, LogAcceso } = require('../../models');
const jwt = require('jsonwebtoken');

describe('Pruebas de Reglas de Negocio - Transacciones', () => {
  let token;
  let cuentaOrigenId;
  let cuentaDestinoId;
  let tipoTransaccionId;

  beforeAll(async () => {
    // Limpiar tablas dependientes para evitar errores de clave foránea
    await sequelize.models.Transaccion.destroy({ where: {}, force: true });
    await Sesion.destroy({ where: {}, force: true });
    await LogAcceso.destroy({ where: {}, force: true });
    await Cuenta.destroy({ where: {}, force: true });
    await Usuario.destroy({ where: {}, force: true });

    const [rol] = await Rol.findOrCreate({ where: { nombre: 'Administrador' } });
    const [moneda] = await Moneda.findOrCreate({
      where: { codigo: 'NIO' },
      defaults: { nombre: 'Cordobas', simbolo: 'C$', tasa_cambio_usd: 36.50 }
    });
    const [tipo] = await TipoCuenta.findOrCreate({ where: { nombre: 'Ahorro' } });
    const [tipoT] = await TipoTransaccion.findOrCreate({ where: { nombre: 'Transferencia' } });
    const [sucursal] = await Sucursal.findOrCreate({
      where: { nombre: 'Sucursal Test' },
      defaults: { direccion: 'Direccion Test', telefono: '12345678', estado: 'activa' }
    });

    tipoTransaccionId = tipoT.id;

    const usuario = await Usuario.create({
      nombre_completo: 'Banquero Test',
      email: 'banquero@test.com',
      contrasenia_hash: 'hash',
      rol_id: rol.id,
      estado: 'activo'
    });
    token = jwt.sign({ id: usuario.id, rol_id: rol.id }, process.env.JWT_SECRET);

    const c1 = await Cuenta.create({
      usuario_id: usuario.id,
      tipo_cuenta_id: tipo.id,
      moneda_id: moneda.id,
      sucursal_id: sucursal.id,
      numero_cuenta: 'TEST-001',
      saldo: 1000.00,
      saldo_disponible: 1000.00,
      fecha_apertura: new Date().toISOString().split('T')[0],
      estado: 'activa'
    });
    cuentaOrigenId = c1.id;

    const c2 = await Cuenta.create({
      usuario_id: usuario.id,
      tipo_cuenta_id: tipo.id,
      moneda_id: moneda.id,
      sucursal_id: sucursal.id,
      numero_cuenta: 'TEST-002',
      saldo: 0.00,
      saldo_disponible: 0.00,
      fecha_apertura: new Date().toISOString().split('T')[0],
      estado: 'activa'
    });
    cuentaDestinoId = c2.id;
  });

  afterAll(async () => {
    // Limpiar tablas dependientes antes de usuarios
    await sequelize.models.Transaccion.destroy({ where: {}, force: true });
    await Sesion.destroy({ where: {}, force: true });
    await LogAcceso.destroy({ where: {}, force: true });
    await Cuenta.destroy({ where: {}, force: true });
    await Usuario.destroy({ where: {}, force: true });
    await sequelize.close();
  });

  test('Debería fallar si se intenta transferir a la misma cuenta', async () => {
    const res = await request(app)
      .post('/api/transacciones/transferencia')
      .set('Authorization', `Bearer ${token}`)
      .send({
        cuenta_origen_id: cuentaOrigenId,
        cuenta_destino_id: cuentaOrigenId,
        monto: 100
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toMatch(/misma cuenta/);
  });

  test('Debería fallar si el saldo es insuficiente', async () => {
    const res = await request(app)
      .post('/api/transacciones/transferencia')
      .set('Authorization', `Bearer ${token}`)
      .send({
        cuenta_origen_id: cuentaOrigenId,
        cuenta_destino_id: cuentaDestinoId,
        monto: 5000
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toMatch(/Fondos insuficientes/);
  });

  test('Debería realizar una transferencia exitosa y actualizar saldos', async () => {
    const montoATransferir = 200;

    const res = await request(app)
      .post('/api/transacciones/transferencia')
      .set('Authorization', `Bearer ${token}`)
      .send({
        cuenta_origen_id: cuentaOrigenId,
        cuenta_destino_id: cuentaDestinoId,
        monto: montoATransferir,
        tipo_transaccion_id: tipoTransaccionId,
        referencia: 'REF-' + Date.now(),
        descripcion: 'Test transferencia exitosa'
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body.message).toMatch(/éxito/);

    const cOrigen = await Cuenta.findByPk(cuentaOrigenId);
    const cDestino = await Cuenta.findByPk(cuentaDestinoId);

    expect(parseFloat(cOrigen.saldo)).toEqual(800.00);
    expect(parseFloat(cDestino.saldo)).toEqual(200.00);
  });
});
