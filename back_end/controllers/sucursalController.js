const { Sucursal } = require('../models');

const sucursalController = {
  findAll: async (req, res) => {
    try {
      const sucursales = await Sucursal.findAll();
      res.status(200).json(sucursales);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener sucursales', error: error.message });
    }
  },

  findByPk: async (req, res) => {
    try {
      const { id } = req.params;
      const sucursal = await Sucursal.findByPk(id);
      if (!sucursal) {
        return res.status(404).json({ message: 'Sucursal no encontrada' });
      }
      res.status(200).json(sucursal);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener sucursal', error: error.message });
    }
  },

  create: async (req, res) => {
    try {
      const sucursal = await Sucursal.create(req.body);
      res.status(201).json(sucursal);
    } catch (error) {
      res.status(400).json({ message: 'Error al crear sucursal', error: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const sucursal = await Sucursal.findByPk(id);
      if (!sucursal) {
        return res.status(404).json({ message: 'Sucursal no encontrada' });
      }
      await sucursal.update(req.body);
      res.status(200).json(sucursal);
    } catch (error) {
      res.status(400).json({ message: 'Error al actualizar sucursal', error: error.message });
    }
  },

  destroy: async (req, res) => {
    try {
      const { id } = req.params;
      const sucursal = await Sucursal.findByPk(id);
      if (!sucursal) {
        return res.status(404).json({ message: 'Sucursal no encontrada' });
      }
      await sucursal.destroy();
      res.status(200).json({ message: 'Sucursal eliminada exitosamente' });
    } catch (error) {
      res.status(500).json({ message: 'Error al eliminar sucursal', error: error.message });
    }
  }
};

module.exports = sucursalController;
