const { LogAcceso } = require('../models');

const logAccesoController = {
  findAll: async (req, res) => {
    try {
      const logs = await LogAcceso.findAll();
      res.status(200).json(logs);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener logs de acceso', error: error.message });
    }
  },

  findByPk: async (req, res) => {
    try {
      const { id } = req.params;
      const log = await LogAcceso.findByPk(id);
      if (!log) {
        return res.status(404).json({ message: 'Log de acceso no encontrado' });
      }
      res.status(200).json(log);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener log de acceso', error: error.message });
    }
  },

  create: async (req, res) => {
    try {
      const log = await LogAcceso.create(req.body);
      res.status(201).json(log);
    } catch (error) {
      res.status(400).json({ message: 'Error al crear log de acceso', error: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const log = await LogAcceso.findByPk(id);
      if (!log) {
        return res.status(404).json({ message: 'Log de acceso no encontrado' });
      }
      await log.update(req.body);
      res.status(200).json(log);
    } catch (error) {
      res.status(400).json({ message: 'Error al actualizar log de acceso', error: error.message });
    }
  },

  destroy: async (req, res) => {
    try {
      const { id } = req.params;
      const log = await LogAcceso.findByPk(id);
      if (!log) {
        return res.status(404).json({ message: 'Log de acceso no encontrado' });
      }
      await log.destroy();
      res.status(200).json({ message: 'Log de acceso eliminado exitosamente' });
    } catch (error) {
      res.status(500).json({ message: 'Error al eliminar log de acceso', error: error.message });
    }
  }
};

module.exports = logAccesoController;
