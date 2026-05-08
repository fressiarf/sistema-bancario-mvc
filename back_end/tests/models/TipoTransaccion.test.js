const { sequelize, TipoTransaccion } = require('../../models');

beforeAll(async () => {
  await sequelize.sync();
});

afterAll(async () => {
  await sequelize.close();
});

describe('Modelo TipoTransaccion', () => {
  test('Happy Path: Debería crear un tipo de transacción válido', async () => {
    const tipo = await TipoTransaccion.create({
      nombre: `TT_${Date.now()}`,
      requiere_aprobacion: true
    });
    expect(tipo.id).toBeDefined();
    expect(tipo.requiere_aprobacion).toBe(true);
  });

  test('Validación de Campos: Debería fallar si el nombre está vacío', async () => {
    try {
      await TipoTransaccion.create({ nombre: '' });
      fail('Debería haber lanzado un error de validación');
    } catch (error) {
      expect(error.errors[0].message).toMatch(/no puede estar vacío/);
    }
  });

  test('Lógica/Restricción: El nombre debe ser único', async () => {
    const nombre = `UnicoTT_${Date.now()}`;
    await TipoTransaccion.create({ nombre });

    try {
      await TipoTransaccion.create({ nombre });
      fail('Debería haber lanzado un error de duplicidad');
    } catch (error) {
      expect(error.name).toBe('SequelizeUniqueConstraintError');
    }
  });
});
