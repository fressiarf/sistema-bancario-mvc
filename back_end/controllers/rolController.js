const { Rol } = require('../models');

const rolController = {
  findAll: async (req, res) => {
    try {
      const roles = await Rol.findAll();
      res.status(200).json(roles);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener roles', error: error.message });
    }
  },

  findByPk: async (req, res) => {
    try {
      const { id } = req.params;
      const rol = await Rol.findByPk(id);
      if (!rol) {
        return res.status(404).json({ message: 'Rol no encontrado' });
      }
      res.status(200).json(rol);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener rol', error: error.message });
    }
  },

  create: async (req, res) => {
    try {
      const rol = await Rol.create(req.body);
      res.status(201).json(rol);
    } catch (error) {
      res.status(400).json({ message: 'Error al crear rol', error: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const rol = await Rol.findByPk(id);
      if (!rol) {
        return res.status(404).json({ message: 'Rol no encontrado' });
      }
      await rol.update(req.body);
      res.status(200).json(rol);
    } catch (error) {
      res.status(400).json({ message: 'Error al actualizar rol', error: error.message });
    }
  },

  destroy: async (req, res) => {
    try {
      const { id } = req.params;
      const rol = await Rol.findByPk(id);
      if (!rol) {
        return res.status(404).json({ message: 'Rol no encontrado' });
      }
      await rol.destroy();
      res.status(200).json({ message: 'Rol eliminado exitosamente' });
    } catch (error) {
      res.status(500).json({ message: 'Error al eliminar rol', error: error.message });
    }
  }
};

module.exports = rolController;
