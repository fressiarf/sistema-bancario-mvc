const { TipoTransaccion } = require('../models');

const tipoTransaccionController = {
  findAll: async (req, res) => {
    try {
      const tipos = await TipoTransaccion.findAll();
      res.status(200).json(tipos);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener tipos de transacción', error: error.message });
    }
  },

  findByPk: async (req, res) => {
    try {
      const { id } = req.params;
      const tipo = await TipoTransaccion.findByPk(id);
      if (!tipo) {
        return res.status(404).json({ message: 'Tipo de transacción no encontrado' });
      }
      res.status(200).json(tipo);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener tipo de transacción', error: error.message });
    }
  },

  create: async (req, res) => {
    try {
      const tipo = await TipoTransaccion.create(req.body);
      res.status(201).json(tipo);
    } catch (error) {
      res.status(400).json({ message: 'Error al crear tipo de transacción', error: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const tipo = await TipoTransaccion.findByPk(id);
      if (!tipo) {
        return res.status(404).json({ message: 'Tipo de transacción no encontrado' });
      }
      await tipo.update(req.body);
      res.status(200).json(tipo);
    } catch (error) {
      res.status(400).json({ message: 'Error al actualizar tipo de transacción', error: error.message });
    }
  },

  destroy: async (req, res) => {
    try {
      const { id } = req.params;
      const tipo = await TipoTransaccion.findByPk(id);
      if (!tipo) {
        return res.status(404).json({ message: 'Tipo de transacción no encontrado' });
      }
      await tipo.destroy();
      res.status(200).json({ message: 'Tipo de transacción eliminado exitosamente' });
    } catch (error) {
      res.status(500).json({ message: 'Error al eliminar tipo de transacción', error: error.message });
    }
  }
};

module.exports = tipoTransaccionController;
