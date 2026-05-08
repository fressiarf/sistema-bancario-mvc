const restringirA = (...rolesPermitidos) => {
  return async (req, res, next) => {
    try {
      const rol = await req.usuario.getRol();
      const nombreRol = rol.nombre;

      if (rol.id === 5 || nombreRol === 'SuperAdministrador') {
        return next();
      }

      if (!rolesPermitidos.includes(nombreRol)) {
        return res.status(403).json({
          message: 'No tienes permisos para esta acción.',
        });
      }

      next();
    } catch (error) {
      res.status(500).json({
        message: 'Error de autorización.',
        error: error.message,
      });
    }
  };
};

module.exports = { restringirA };
