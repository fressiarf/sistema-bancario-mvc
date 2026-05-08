const { sequelize, TasaInteres, TipoCuenta } = require('../../models');

beforeAll(async () => {
  await sequelize.sync();
});

afterAll(async () => {
  await sequelize.close();
});

describe('Modelo TasaInteres', () => {
  let tipoId;

  beforeAll(async () => {
    const [tipo] = await TipoCuenta.findOrCreate({ where: { nombre: 'Ahorro Fijo' } });
    tipoId = tipo.id;
  });

  test('Happy Path: Debería crear una tasa de interés válida', async () => {
    const tasa = await TasaInteres.create({
      tipo_cuenta_id: tipoId,
      tasa: 5.5,
      fecha_ini: '2023-01-01'
    });
    expect(tasa.id).toBeDefined();
    expect(parseFloat(tasa.tasa)).toBe(5.5);
  });

  test('Validación de Campos: Debería fallar si la tasa es mayor a 100', async () => {
    try {
      await TasaInteres.create({
        tipo_cuenta_id: tipoId,
        tasa: 101,
        fecha_ini: '2023-01-01'
      });
      fail('Debería haber lanzado un error por tasa > 100');
    } catch (error) {
      expect(error.errors[0].message).toMatch(/no puede superar el 100%/);
    }
  });

  test('Lógica/Restricción: Fecha fin debe ser posterior a fecha inicio', async () => {
    try {
      await TasaInteres.create({
        tipo_cuenta_id: tipoId,
        tasa: 5,
        fecha_ini: '2023-12-31',
        fecha_fin: '2023-01-01'
      });
      fail('Debería haber lanzado un error por fecha_fin anterior');
    } catch (error) {
      expect(error.errors[0].message).toMatch(/debe ser posterior a la fecha de inicio/);
    }
  });
});
