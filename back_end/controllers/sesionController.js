const { Sesion } = require('../models');

const sesionController = {
  findAll: async (req, res) => {
    try {
      const sesiones = await Sesion.findAll();
      res.status(200).json(sesiones);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener sesiones', error: error.message });
    }
  },

  findByPk: async (req, res) => {
    try {
      const { id } = req.params;
      const sesion = await Sesion.findByPk(id);
      if (!sesion) {
        return res.status(404).json({ message: 'Sesión no encontrada' });
      }
      res.status(200).json(sesion);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener sesión', error: error.message });
    }
  },

  create: async (req, res) => {
    try {
      const sesion = await Sesion.create(req.body);
      res.status(201).json(sesion);
    } catch (error) {
      res.status(400).json({ message: 'Error al crear sesión', error: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const sesion = await Sesion.findByPk(id);
      if (!sesion) {
        return res.status(404).json({ message: 'Sesión no encontrada' });
      }
      await sesion.update(req.body);
      res.status(200).json(sesion);
    } catch (error) {
      res.status(400).json({ message: 'Error al actualizar sesión', error: error.message });
    }
  },

  destroy: async (req, res) => {
    try {
      const { id } = req.params;
      const sesion = await Sesion.findByPk(id);
      if (!sesion) {
        return res.status(404).json({ message: 'Sesión no encontrada' });
      }
      await sesion.destroy();
      res.status(200).json({ message: 'Sesión eliminada exitosamente' });
    } catch (error) {
      res.status(500).json({ message: 'Error al eliminar sesión', error: error.message });
    }
  }
};

module.exports = sesionController;
