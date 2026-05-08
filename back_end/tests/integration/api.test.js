const request = require('supertest');
const app = require('../../index');
const { sequelize } = require('../../models');

afterAll(async () => {
  await sequelize.close();
});

describe('Pruebas generales de la API', () => {

  test('Debería retornar el mensaje de bienvenida de la raíz', async () => {
    const res = await request(app).get('/');

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Bienvenido a la API del Sistema Bancario MVC');
  });

  test('Debería retornar 404 para una ruta que no existe', async () => {
    const res = await request(app).get('/ruta-inexistente');

    expect(res.statusCode).toEqual(404);
  });

  test('Debería retornar 401 para una ruta protegida sin token', async () => {
    const res = await request(app).get('/api/usuarios');

    expect(res.statusCode).toEqual(401);
  });
});
