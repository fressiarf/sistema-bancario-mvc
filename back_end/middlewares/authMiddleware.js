const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');

const verificarToken = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ message: 'No autenticado. Inicie sesión.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const usuarioActual = await Usuario.findByPk(decoded.id);
    if (!usuarioActual) {
      return res.status(401).json({ message: 'Usuario inexistente.' });
    }

    if (usuarioActual.estado !== 'activo') {
      return res.status(403).json({ message: 'Cuenta bloqueada o suspendida.' });
    }

    req.usuario = usuarioActual;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Token inválido.' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Sesión expirada. Inicie sesión nuevamente.' });
    }
    res.status(500).json({ message: 'Error de autenticación.', error: error.message });
  }
};

module.exports = { verificarToken };
