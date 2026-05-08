const request = require('supertest');
const app = require('../../index');
const { sequelize, Usuario, Rol } = require('../../models');
const jwt = require('jsonwebtoken');

describe('Pruebas de Roles y Permisos', () => {
  let superAdminToken;
  let empleadoToken;

  beforeAll(async () => {

    await Usuario.destroy({ where: {} });

    const [rolSA] = await Rol.findOrCreate({ where: { id: 5, nombre: 'SuperAdministrador' } });
    const [rolEmp] = await Rol.findOrCreate({ where: { id: 1, nombre: 'Empleado' } });

    const admin = await Usuario.create({
      nombre_completo: 'Admin Test',
      email: 'admin@test.com',
      contrasenia_hash: 'hash',
      rol_id: rolSA.id,
      estado: 'activo'
    });

    const empleado = await Usuario.create({
      nombre_completo: 'Empleado Test',
      email: 'empleado@test.com',
      contrasenia_hash: 'hash',
      rol_id: rolEmp.id,
      estado: 'activo'
    });

    superAdminToken = jwt.sign({ id: admin.id, rol_id: rolSA.id }, process.env.JWT_SECRET);
    empleadoToken = jwt.sign({ id: empleado.id, rol_id: rolEmp.id }, process.env.JWT_SECRET);
  });

  afterAll(async () => {

    await Usuario.destroy({ where: {} });
    await sequelize.close();
  });

  test('Debería denegar acceso (401) si no se envía token', async () => {
    const res = await request(app).get('/api/roles');
    expect(res.statusCode).toEqual(401);
  });

  test('Debería denegar acceso (403) a un Empleado intentando ver roles', async () => {
    const res = await request(app)
      .get('/api/roles')
      .set('Authorization', `Bearer ${empleadoToken}`);

    expect(res.statusCode).toEqual(403);
    expect(res.body.message).toMatch(/No tienes permisos/);
  });

  test('Debería permitir acceso (200) al SuperAdministrador', async () => {
    const res = await request(app)
      .get('/api/roles')
      .set('Authorization', `Bearer ${superAdminToken}`);

    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
