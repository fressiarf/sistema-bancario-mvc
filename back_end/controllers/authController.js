const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Usuario, LogAcceso, Rol } = require('../models');

const generarToken = (id, rol_id) => {
  return jwt.sign({ id, rol_id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '8h',
  });
};

const authController = {
  login: async (req, res) => {
    try {
      const { email, contrasenia } = req.body;

      if (!email || !contrasenia) {
        return res.status(400).json({
          message: 'Proporcione correo y contraseña.',
        });
      }

      // Buscar usuario incluyendo el hash de contraseña y el ROL
      const usuario = await Usuario.unscoped().findOne({ 
        where: { email },
        include: [{ model: Rol, as: 'rol', attributes: ['nombre'] }]
      });

      // Validar existencia y contraseña
      if (!usuario || !(await bcrypt.compare(contrasenia, usuario.contrasenia_hash))) {
        if (usuario) {
          await LogAcceso.create({
            usuario_id: usuario.id,
            accion: 'LOGIN',
            ip: req.ip === '::1' ? '127.0.0.1' : req.ip,
            descripcion: 'Fallo: Contraseña incorrecta',
            exitoso: false,
          });
        }
        return res.status(401).json({ message: 'Credenciales incorrectas.' });
      }

      // Validar estado de la cuenta
      if (usuario.estado !== 'activo') {
        await LogAcceso.create({
          usuario_id: usuario.id,
          accion: 'LOGIN_BLOQUEADO',
          ip: req.ip === '::1' ? '127.0.0.1' : req.ip,
          descripcion: `Fallo: Cuenta ${usuario.estado}`,
          exitoso: false,
        });
        return res.status(403).json({ message: `Cuenta ${usuario.estado}. Contacte a soporte.` });
      }

      const token = generarToken(usuario.id, usuario.rol_id);

      // Enviar token en cookie
      res.cookie('token', token, {
        httpOnly: true, // Protege contra XSS
        secure: process.env.NODE_ENV === 'production', // Solo HTTPS en producción
        maxAge: 8 * 60 * 60 * 1000 // 8 horas
      });

      await LogAcceso.create({
        usuario_id: usuario.id,
        accion: 'LOGIN',
        ip: req.ip === '::1' ? '127.0.0.1' : req.ip,
        descripcion: 'Login exitoso',
        exitoso: true,
      });

      const datosUsuario = { ...usuario.get() };
      delete datosUsuario.contrasenia_hash;

      res.status(200).json({
        message: 'Autenticación exitosa',
        usuario: datosUsuario,
      });
    } catch (error) {
      console.error('Error login:', error);
      res.status(500).json({ message: 'Error interno del servidor.', error: error.message });
    }
  },
};

module.exports = authController;
