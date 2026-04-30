const { Usuario, Rol } = require('../models');

const usuarioController = {
  findAll: async (req, res) => {
    try {
      const usuarios = await Usuario.findAll({
        attributes: { exclude: ['password_hash'] }, // Nunca devolver la contraseña
        include: [{ model: Rol, as: 'rol' }]
      });
      res.status(200).json(usuarios);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener usuarios', error: error.message });
    }
  },

  findByPk: async (req, res) => {
    try {
      const { id } = req.params;
      const usuario = await Usuario.findByPk(id, {
        attributes: { exclude: ['password_hash'] },
        include: [{ model: Rol, as: 'rol' }]
      });
      if (!usuario) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
      res.status(200).json(usuario);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener usuario', error: error.message });
    }
  },

  create: async (req, res) => {
    try {
      // En un flujo real, aquí encriptarías la contraseña (ej. bcrypt.hash)
      // antes de guardarla en password_hash.
      const usuario = await Usuario.create(req.body);
      const { password_hash, ...usuarioSafe } = usuario.toJSON();
      res.status(201).json(usuarioSafe);
    } catch (error) {
      res.status(400).json({ message: 'Error al crear usuario', error: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const usuario = await Usuario.findByPk(id);
      if (!usuario) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
      // Si se actualiza la contraseña, debe re-encriptarse aquí
      await usuario.update(req.body);
      const { password_hash, ...usuarioSafe } = usuario.toJSON();
      res.status(200).json(usuarioSafe);
    } catch (error) {
      res.status(400).json({ message: 'Error al actualizar usuario', error: error.message });
    }
  },

  destroy: async (req, res) => {
    try {
      const { id } = req.params;
      const usuario = await Usuario.findByPk(id);
      if (!usuario) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
      await usuario.destroy();
      res.status(200).json({ message: 'Usuario eliminado exitosamente' });
    } catch (error) {
      res.status(500).json({ message: 'Error al eliminar usuario', error: error.message });
    }
  }
};

module.exports = usuarioController;
