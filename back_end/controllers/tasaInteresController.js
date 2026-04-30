const { TasaInteres } = require('../models');

const tasaInteresController = {
  findAll: async (req, res) => {
    try {
      const tasas = await TasaInteres.findAll();
      res.status(200).json(tasas);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener tasas de interés', error: error.message });
    }
  },

  findByPk: async (req, res) => {
    try {
      const { id } = req.params;
      const tasa = await TasaInteres.findByPk(id);
      if (!tasa) {
        return res.status(404).json({ message: 'Tasa de interés no encontrada' });
      }
      res.status(200).json(tasa);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener tasa de interés', error: error.message });
    }
  },

  create: async (req, res) => {
    try {
      const tasa = await TasaInteres.create(req.body);
      res.status(201).json(tasa);
    } catch (error) {
      res.status(400).json({ message: 'Error al crear tasa de interés', error: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const tasa = await TasaInteres.findByPk(id);
      if (!tasa) {
        return res.status(404).json({ message: 'Tasa de interés no encontrada' });
      }
      await tasa.update(req.body);
      res.status(200).json(tasa);
    } catch (error) {
      res.status(400).json({ message: 'Error al actualizar tasa de interés', error: error.message });
    }
  },

  destroy: async (req, res) => {
    try {
      const { id } = req.params;
      const tasa = await TasaInteres.findByPk(id);
      if (!tasa) {
        return res.status(404).json({ message: 'Tasa de interés no encontrada' });
      }
      await tasa.destroy();
      res.status(200).json({ message: 'Tasa de interés eliminada exitosamente' });
    } catch (error) {
      res.status(500).json({ message: 'Error al eliminar tasa de interés', error: error.message });
    }
  }
};

module.exports = tasaInteresController;
