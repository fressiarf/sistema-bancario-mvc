const { Transaccion, Cuenta, sequelize } = require('../models');

const transaccionController = {
  findAll: async (req, res) => {
    try {
      const transacciones = await Transaccion.findAll();
      res.status(200).json(transacciones);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener transacciones', error: error.message });
    }
  },

  findByPk: async (req, res) => {
    try {
      const { id } = req.params;
      const transaccion = await Transaccion.findByPk(id);
      if (!transaccion) {
        return res.status(404).json({ message: 'Transacción no encontrada' });
      }
      res.status(200).json(transaccion);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener transacción', error: error.message });
    }
  },

  create: async (req, res) => {
    try {
      const transaccion = await Transaccion.create(req.body);
      res.status(201).json(transaccion);
    } catch (error) {
      res.status(400).json({ message: 'Error al crear transacción', error: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const transaccion = await Transaccion.findByPk(id);
      if (!transaccion) {
        return res.status(404).json({ message: 'Transacción no encontrada' });
      }
      await transaccion.update(req.body);
      res.status(200).json(transaccion);
    } catch (error) {
      res.status(400).json({ message: 'Error al actualizar transacción', error: error.message });
    }
  },

  destroy: async (req, res) => {
    try {
      const { id } = req.params;
      const transaccion = await Transaccion.findByPk(id);
      if (!transaccion) {
        return res.status(404).json({ message: 'Transacción no encontrada' });
      }
      await transaccion.destroy();
      res.status(200).json({ message: 'Transacción eliminada exitosamente' });
    } catch (error) {
      res.status(500).json({ message: 'Error al eliminar transacción', error: error.message });
    }
  },

  // Lógica de negocio bancaria: Transferencia con Transacción de Sequelize
  realizarTransferencia: async (req, res) => {
    const t = await sequelize.transaction();

    try {
      const {
        cuenta_origen_id,
        cuenta_destino_id,
        monto,
        tipo_transaccion_id,
        comision = 0,
        referencia,
        descripcion
      } = req.body;

      // 1. Validar autotransferencia
      if (cuenta_origen_id === cuenta_destino_id) {
        throw new Error('No se permite realizar transferencias a la misma cuenta de origen.');
      }

      // 2. Validar montos y cuentas
      const montoNum = parseFloat(monto);
      const comisionNum = parseFloat(comision);
      const montoTotal = montoNum + comisionNum;

      if (montoNum <= 0) {
        throw new Error('El monto debe ser mayor a 0');
      }

      const cuentaOrigen = await Cuenta.findByPk(cuenta_origen_id, { transaction: t });
      const cuentaDestino = await Cuenta.findByPk(cuenta_destino_id, { transaction: t });

      if (!cuentaOrigen) throw new Error('La cuenta de origen no existe');
      if (!cuentaDestino) throw new Error('La cuenta de destino no existe');
      if (cuentaOrigen.estado !== 'activa') {
        throw new Error(`La cuenta de origen está ${cuentaOrigen.estado}. Solo las cuentas activas pueden transferir.`);
      }
      if (cuentaDestino.estado !== 'activa' && cuentaDestino.estado !== 'bloqueada') {
        throw new Error('La cuenta de destino no está apta para recibir fondos');
      }

      // 3. Validar saldo disponible
      if (parseFloat(cuentaOrigen.saldo_disponible) < montoTotal) {
        throw new Error('Fondos insuficientes en la cuenta de origen');
      }

      // 4. Descontar de cuenta origen
      await cuentaOrigen.update({
        saldo: parseFloat(cuentaOrigen.saldo) - montoTotal,
        saldo_disponible: parseFloat(cuentaOrigen.saldo_disponible) - montoTotal
      }, { transaction: t });

      // 5. Sumar a cuenta destino (solo se suma el monto, no la comisión)
      await cuentaDestino.update({
        saldo: parseFloat(cuentaDestino.saldo) + montoNum,
        saldo_disponible: parseFloat(cuentaDestino.saldo_disponible) + montoNum
      }, { transaction: t });

      // 6. Registrar la transacción
      const nuevaTransaccion = await Transaccion.create({
        tipo_transaccion_id,
        cuenta_origen_id,
        cuenta_destino_id,
        monto: montoNum,
        comision: comisionNum,
        monto_total: montoTotal,
        referencia,
        descripcion,
        estado: 'completada'
      }, { transaction: t });

      // Si todo sale bien, hacemos commit
      await t.commit();
      res.status(201).json({
        message: 'Transferencia realizada con éxito',
        transaccion: nuevaTransaccion
      });

    } catch (error) {
      // Si algo falla, revertimos todos los cambios en base de datos
      if (t) await t.rollback();
      res.status(400).json({ message: 'Error en la transferencia', error: error.message });
    }
  }
};

module.exports = transaccionController;
