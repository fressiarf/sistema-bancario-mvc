const { Cuenta, Usuario, TipoCuenta, Moneda, Sucursal } = require('../models');

const cuentaController = {
  findAll: async (req, res) => {
    try {
      const cuentas = await Cuenta.findAll({
        include: [
          { model: Usuario, as: 'propietario', attributes: ['id', 'nombre', 'apellidos'] },
          { model: TipoCuenta, as: 'tipoCuenta' },
          { model: Moneda, as: 'moneda' },
          { model: Sucursal, as: 'sucursal' }
        ]
      });
      res.status(200).json(cuentas);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener cuentas', error: error.message });
    }
  },

  findByPk: async (req, res) => {
    try {
      const { id } = req.params;
      const cuenta = await Cuenta.findByPk(id, {
        include: [
          { model: Usuario, as: 'propietario', attributes: ['id', 'nombre', 'apellidos'] },
          { model: TipoCuenta, as: 'tipoCuenta' },
          { model: Moneda, as: 'moneda' },
          { model: Sucursal, as: 'sucursal' }
        ]
      });
      if (!cuenta) {
        return res.status(404).json({ message: 'Cuenta no encontrada' });
      }
      res.status(200).json(cuenta);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener cuenta', error: error.message });
    }
  },

  create: async (req, res) => {
    try {
      const cuenta = await Cuenta.create(req.body);
      res.status(201).json(cuenta);
    } catch (error) {
      res.status(400).json({ message: 'Error al crear cuenta', error: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const cuenta = await Cuenta.findByPk(id);
      if (!cuenta) {
        return res.status(404).json({ message: 'Cuenta no encontrada' });
      }
      await cuenta.update(req.body);
      res.status(200).json(cuenta);
    } catch (error) {
      res.status(400).json({ message: 'Error al actualizar cuenta', error: error.message });
    }
  },

  destroy: async (req, res) => {
    try {
      const { id } = req.params;
      const cuenta = await Cuenta.findByPk(id);
      if (!cuenta) {
        return res.status(404).json({ message: 'Cuenta no encontrada' });
      }
      await cuenta.destroy();
      res.status(200).json({ message: 'Cuenta eliminada exitosamente' });
    } catch (error) {
      res.status(500).json({ message: 'Error al eliminar cuenta', error: error.message });
    }
  }
};

module.exports = cuentaController;
