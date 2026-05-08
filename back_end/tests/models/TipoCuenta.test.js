const { sequelize, TipoCuenta } = require('../../models');

beforeAll(async () => {
  await sequelize.sync();
});

afterAll(async () => {
  await sequelize.close();
});

describe('Modelo TipoCuenta', () => {
  test('Happy Path: Debería crear un tipo de cuenta válido', async () => {
    const tipo = await TipoCuenta.create({
      nombre: `Tipo_${Date.now()}`,
      tasa_base: 2.5
    });
    expect(tipo.id).toBeDefined();
    expect(parseFloat(tipo.tasa_base)).toBe(2.5);
  });

  test('Validación de Campos: Debería fallar si la tasa base es negativa', async () => {
    try {
      await TipoCuenta.create({
        nombre: 'Tasa Negativa',
        tasa_base: -1.0
      });
      fail('Debería haber lanzado un error por tasa negativa');
    } catch (error) {
      expect(error.errors[0].message).toMatch(/no puede ser negativa/);
    }
  });

  test('Lógica/Restricción: El nombre debe ser único', async () => {
    const nombre = `UnicoTC_${Date.now()}`;
    await TipoCuenta.create({ nombre });

    try {
      await TipoCuenta.create({ nombre });
      fail('Debería haber lanzado un error de duplicidad');
    } catch (error) {
      expect(error.name).toBe('SequelizeUniqueConstraintError');
    }
  });
});
