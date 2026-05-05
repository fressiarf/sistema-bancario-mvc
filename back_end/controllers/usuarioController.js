const { Usuario, Rol } = require('../models');
const bcrypt = require('bcryptjs');

const usuarioController = {
  // El usuario autenticado consulta su propia info
  miPerfil: async (req, res) => {
    try {
      const usuario = await Usuario.findByPk(req.usuario.id, {
        attributes: { exclude: ['contrasenia_hash'] },
        include: [{ model: Rol, as: 'rol', attributes: ['nombre'] }]
      });
      res.status(200).json(usuario);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener perfil', error: error.message });
    }
  },

  findAll: async (req, res) => {
    try {
      const usuarios = await Usuario.findAll({
        attributes: { exclude: ['contrasenia_hash'] },
        include: [{ model: Rol, as: 'rol', attributes: ['nombre'] }]
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
        attributes: { exclude: ['contrasenia_hash'] },
        include: [{ model: Rol, as: 'rol', attributes: ['nombre'] }]
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
      const { contrasenia, ...userData } = req.body;
      
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(contrasenia, salt);
      
      const usuario = await Usuario.create({
        ...userData,
        contrasenia_hash: hashedPassword
      });
      
      res.status(201).json(usuario);
    } catch (error) {
      res.status(400).json({ message: 'Error al crear usuario', error: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { contrasenia, ...userData } = req.body;
      
      const usuario = await Usuario.findByPk(id);
      if (!usuario) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      if (contrasenia) {
        const salt = await bcrypt.genSalt(10);
        userData.contrasenia_hash = await bcrypt.hash(contrasenia, salt);
      }

      await usuario.update(userData);
      res.status(200).json(usuario);
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
      res.status(200).json({ message: 'Usuario eliminado' });
    } catch (error) {
      res.status(500).json({ message: 'Error al eliminar usuario', error: error.message });
    }
  }
};

module.exports = usuarioController;
