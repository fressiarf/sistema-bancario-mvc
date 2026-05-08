const { sequelize, Sucursal } = require('../../models');

beforeAll(async () => {
  await sequelize.sync();
});

afterAll(async () => {
  await sequelize.close();
});

describe('Modelo Sucursal', () => {
  test('Happy Path: Debería crear una sucursal válida', async () => {
    const sucursal = await Sucursal.create({
      nombre: 'Sucursal Central',
      direccion: 'Av. Principal 123',
      ciudad: 'Managua',
      telefono: '2222-3333'
    });
    expect(sucursal.id).toBeDefined();
    expect(sucursal.estado).toBe('activa');
  });

  test('Validación de Campos: Debería fallar si el nombre está vacío', async () => {
    try {
      await Sucursal.create({ nombre: '' });
      fail('Debería haber lanzado un error de validación');
    } catch (error) {
      expect(error.name).toBe('SequelizeValidationError');
      expect(error.errors[0].message).toMatch(/no puede estar vacío/);
    }
  });

  test('Lógica/Restricción: Debería validar que el estado sea activa o inactiva', async () => {
    try {
      await Sucursal.create({
        nombre: 'Sucursal Error',
        estado: 'pendiente'
      });
      fail('Debería haber lanzado un error por estado inválido');
    } catch (error) {
      expect(error.name).toBe('SequelizeValidationError');
      expect(error.errors[0].message).toMatch(/El estado debe ser/);
    }
  });
});
