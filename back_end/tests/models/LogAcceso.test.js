const { sequelize, LogAcceso, Usuario, Rol } = require('../../models');

beforeAll(async () => {
  await sequelize.sync();
});

afterAll(async () => {
  await sequelize.close();
});

describe('Modelo LogAcceso', () => {
  let usuarioId;

  beforeAll(async () => {
    const [rol] = await Rol.findOrCreate({ where: { nombre: 'Tester' } });
    const usuario = await Usuario.create({
      nombre_completo: 'Log User',
      email: `log_${Date.now()}@test.com`,
      rol_id: rol.id,
      contrasenia_hash: 'hash'
    });
    usuarioId = usuario.id;
  });

  test('Happy Path: Debería crear un log válido', async () => {
    const log = await LogAcceso.create({
      usuario_id: usuarioId,
      accion: 'LOGIN',
      ip: '127.0.0.1',
      exitoso: true
    });
    expect(log.id).toBeDefined();
    expect(log.accion).toBe('LOGIN');
  });

  test('Validación de Campos: Debería fallar si la acción es nula', async () => {
    try {
      await LogAcceso.create({ exitoso: true });
      fail('Debería haber lanzado un error de validación');
    } catch (error) {
      expect(error.name).toBe('SequelizeValidationError');
    }
  });

  test('Lógica/Restricción: Debería validar formato de IP', async () => {
    try {
      await LogAcceso.create({
        accion: 'TEST',
        ip: 'ip-invalida',
        exitoso: true
      });
      fail('Debería haber lanzado un error por IP inválida');
    } catch (error) {
      expect(error.errors[0].message).toMatch(/IP no tiene un formato válido/);
    }
  });
});
