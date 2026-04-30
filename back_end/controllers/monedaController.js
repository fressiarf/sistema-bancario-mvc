const { Moneda } = require('../models');

const monedaController = {
  findAll: async (req, res) => {
    try {
      const monedas = await Moneda.findAll();
      res.status(200).json(monedas);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener monedas', error: error.message });
    }
  },

  findByPk: async (req, res) => {
    try {
      const { id } = req.params;
      const moneda = await Moneda.findByPk(id);
      if (!moneda) {
        return res.status(404).json({ message: 'Moneda no encontrada' });
      }
      res.status(200).json(moneda);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener moneda', error: error.message });
    }
  },

  create: async (req, res) => {
    try {
      const moneda = await Moneda.create(req.body);
      res.status(201).json(moneda);
    } catch (error) {
      res.status(400).json({ message: 'Error al crear moneda', error: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const moneda = await Moneda.findByPk(id);
      if (!moneda) {
        return res.status(404).json({ message: 'Moneda no encontrada' });
      }
      await moneda.update(req.body);
      res.status(200).json(moneda);
    } catch (error) {
      res.status(400).json({ message: 'Error al actualizar moneda', error: error.message });
    }
  },

  destroy: async (req, res) => {
    try {
      const { id } = req.params;
      const moneda = await Moneda.findByPk(id);
      if (!moneda) {
        return res.status(404).json({ message: 'Moneda no encontrada' });
      }
      await moneda.destroy();
      res.status(200).json({ message: 'Moneda eliminada exitosamente' });
    } catch (error) {
      res.status(500).json({ message: 'Error al eliminar moneda', error: error.message });
    }
  }
};

module.exports = monedaController;
