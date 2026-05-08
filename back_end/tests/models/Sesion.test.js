const { sequelize, Sesion, Usuario, Rol } = require('../../models');

beforeAll(async () => {
  await sequelize.sync();
});

afterAll(async () => {
  await sequelize.close();
});

describe('Modelo Sesion', () => {
  let usuarioId;

  beforeAll(async () => {
    const [rol] = await Rol.findOrCreate({ where: { nombre: 'Tester' } });
    const usuario = await Usuario.create({
      nombre_completo: 'Session User',
      email: `session_${Date.now()}@test.com`,
      rol_id: rol.id,
      contrasenia_hash: 'hash'
    });
    usuarioId = usuario.id;
  });

  test('Happy Path: Debería crear una sesión válida', async () => {
    const exp = new Date();
    exp.setHours(exp.getHours() + 1);
    
    const sesion = await Sesion.create({
      usuario_id: usuarioId,
      token: `token_${Date.now()}`,
      fecha_expiracion: exp
    });
    expect(sesion.id).toBeDefined();
    expect(sesion.activa).toBe(true);
  });

  test('Validación de Campos: Debería fallar si falta el usuario', async () => {
    try {
      await Sesion.create({ token: 'abc', fecha_expiracion: new Date() });
      fail('Debería haber lanzado un error de validación');
    } catch (error) {
      expect(error.name).toBe('SequelizeValidationError');
    }
  });

  test('Lógica/Restricción: Fecha de expiración debe ser futura', async () => {
    const pasado = new Date();
    pasado.setHours(pasado.getHours() - 1);

    try {
      await Sesion.create({
        usuario_id: usuarioId,
        token: `fail_${Date.now()}`,
        fecha_expiracion: pasado
      });
      fail('Debería haber lanzado un error por fecha pasada');
    } catch (error) {
      expect(error.errors[0].message).toMatch(/debe ser una fecha futura/);
    }
  });
});
