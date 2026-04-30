const { TipoCuenta } = require('../models');

const tipoCuentaController = {
  findAll: async (req, res) => {
    try {
      const tipos = await TipoCuenta.findAll();
      res.status(200).json(tipos);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener tipos de cuenta', error: error.message });
    }
  },

  findByPk: async (req, res) => {
    try {
      const { id } = req.params;
      const tipo = await TipoCuenta.findByPk(id);
      if (!tipo) {
        return res.status(404).json({ message: 'Tipo de cuenta no encontrado' });
      }
      res.status(200).json(tipo);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener tipo de cuenta', error: error.message });
    }
  },

  create: async (req, res) => {
    try {
      const tipo = await TipoCuenta.create(req.body);
      res.status(201).json(tipo);
    } catch (error) {
      res.status(400).json({ message: 'Error al crear tipo de cuenta', error: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const tipo = await TipoCuenta.findByPk(id);
      if (!tipo) {
        return res.status(404).json({ message: 'Tipo de cuenta no encontrado' });
      }
      await tipo.update(req.body);
      res.status(200).json(tipo);
    } catch (error) {
      res.status(400).json({ message: 'Error al actualizar tipo de cuenta', error: error.message });
    }
  },

  destroy: async (req, res) => {
    try {
      const { id } = req.params;
      const tipo = await TipoCuenta.findByPk(id);
      if (!tipo) {
        return res.status(404).json({ message: 'Tipo de cuenta no encontrado' });
      }
      await tipo.destroy();
      res.status(200).json({ message: 'Tipo de cuenta eliminado exitosamente' });
    } catch (error) {
      res.status(500).json({ message: 'Error al eliminar tipo de cuenta', error: error.message });
    }
  }
};

module.exports = tipoCuentaController;
