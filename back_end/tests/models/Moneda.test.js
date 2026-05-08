const { sequelize, Moneda, Cuenta, Transaccion } = require('../../models');

beforeAll(async () => {
  await sequelize.sync();
  await Transaccion.destroy({ where: {}, force: true });
  await Cuenta.destroy({ where: {}, force: true });
  await Moneda.destroy({ where: {}, force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe('Modelo Moneda', () => {
  test('Happy Path: Debería crear una moneda válida', async () => {
    const moneda = await Moneda.create({
      codigo: 'EUR',
      nombre: 'Euro',
      simbolo: '€',
      tasa_cambio_usd: 1.08
    });
    expect(moneda.id).toBeDefined();
    expect(moneda.codigo).toBe('EUR');
  });

  test('Validación de Campos: Debería fallar si el código está vacío', async () => {
    try {
      await Moneda.create({ nombre: 'Sin Codigo' });
      fail('Debería haber lanzado un error de validación');
    } catch (error) {
      expect(error.name).toBe('SequelizeValidationError');
    }
  });

  test('Lógica/Restricción: Tasa de cambio debe ser mayor a 0', async () => {
    try {
      await Moneda.create({
        codigo: 'BAD',
        nombre: 'Mala',
        tasa_cambio_usd: 0
      });
      fail('Debería haber lanzado un error por tasa <= 0');
    } catch (error) {
      expect(error.errors[0].message).toMatch(/debe ser mayor a 0/);
    }
  });
});
