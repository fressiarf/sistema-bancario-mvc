const request = require('supertest');
const app = require('../../index');
const { sequelize, Usuario, Rol } = require('../../models');
const bcrypt = require('bcryptjs');

beforeAll(async () => {
  await Usuario.destroy({ where: {} });
  const [rol] = await Rol.findOrCreate({ where: { nombre: 'Cliente' } });
  const hashedPassword = await bcrypt.hash('password123', 10);
  await Usuario.create({
    nombre_completo: 'Auth Test User',
    email: 'auth_test@example.com',
    contrasenia_hash: hashedPassword,
    rol_id: rol.id,
    estado: 'activo'
  });
});

afterAll(async () => {
  await Usuario.destroy({ where: { email: 'auth_test@example.com' } });
  await sequelize.close();
});

describe('Endpoints de Autenticación', () => {

  test('Debería retornar 400 si falta el email o la contraseña', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com' });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('message', 'Proporcione correo y contraseña.');
  });

  test('Debería retornar 401 para credenciales incorrectas', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'noexiste@banco.com',
        contrasenia: '123456'
      });

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('message', 'Credenciales incorrectas.');
  });

  test('Debería iniciar sesión exitosamente con credenciales válidas', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'auth_test@example.com',
        contrasenia: 'password123'
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Autenticación exitosa');
    expect(res.body).toHaveProperty('usuario');
    expect(res.header['set-cookie']).toBeDefined();
  });
});
