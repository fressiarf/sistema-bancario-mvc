const request = require('supertest');
const app = require('../index');
const { sequelize } = require('../models');

afterAll(async () => {
  await sequelize.close(); // Cerramos la conexión a la DB
});

describe('Endpoints de Autenticación', () => {
  
  test('Debería retornar 400 si falta el email o la contraseña', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com' }); // Falta la contraseña

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
});
