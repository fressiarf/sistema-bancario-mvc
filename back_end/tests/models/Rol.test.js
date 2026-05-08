const { sequelize, Rol } = require('../../models');

beforeAll(async () => {
  await sequelize.sync();
});

afterAll(async () => {
  await sequelize.close();
});

describe('Modelo Rol', () => {
  test('Happy Path: Debería crear un rol válido', async () => {
    const rol = await Rol.create({
      nombre: `Rol_${Date.now()}`,
      descripcion: 'Descripción de prueba'
    });
    expect(rol.id).toBeDefined();
    expect(rol.activa).toBe(true);
  });

  test('Validación de Campos: Debería fallar si el nombre es nulo', async () => {
    try {
      await Rol.create({ descripcion: 'Sin nombre' });
      fail('Debería haber lanzado un error de validación');
    } catch (error) {
      expect(error.name).toBe('SequelizeValidationError');
    }
  });

  test('Lógica/Restricción: Debería fallar si el nombre ya existe', async () => {
    const nombreUnico = `Unico_${Date.now()}`;
    await Rol.create({ nombre: nombreUnico });
    
    try {
      await Rol.create({ nombre: nombreUnico });
      fail('Debería haber lanzado un error de unicidad');
    } catch (error) {
      expect(error.name).toBe('SequelizeUniqueConstraintError');
    }
  });
});
