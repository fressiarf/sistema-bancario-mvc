const { sequelize, Usuario, Rol } = require('../../models');

beforeAll(async () => {
  await sequelize.sync();
});

afterAll(async () => {
  await sequelize.close();
});

describe('Modelo Usuario', () => {
  let rolId;

  beforeAll(async () => {
    const [rol] = await Rol.findOrCreate({ where: { nombre: 'Tester' } });
    rolId = rol.id;
  });

  test('Happy Path: Debería crear un usuario válido', async () => {
    const usuarioData = {
      nombre_completo: 'Test User',
      email: `test_${Date.now()}@example.com`,
      rol_id: rolId,
      contrasenia_hash: 'hashed_password'
    };
    const usuario = await Usuario.create(usuarioData);
    expect(usuario.id).toBeDefined();
    expect(usuario.nombre_completo).toBe(usuarioData.nombre_completo);
  });

  test('Validación de Campos: Debería fallar si faltan campos obligatorios', async () => {
    try {
      await Usuario.create({ email: 'no_name@example.com' });
      fail('Debería haber lanzado un error de validación');
    } catch (error) {
      expect(error.name).toBe('SequelizeValidationError');
    }
  });

  test('Lógica/Restricción: Debería validar formato de correo electrónico', async () => {
    try {
      await Usuario.create({
        nombre_completo: 'Invalid Email User',
        email: 'correo-invalido',
        rol_id: rolId,
        contrasenia_hash: 'hashed_password'
      });
      fail('Debería haber lanzado un error por formato de email');
    } catch (error) {
      expect(error.errors[0].message).toMatch(/formato válido/);
    }
  });
});
