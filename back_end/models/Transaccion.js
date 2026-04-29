'use strict';

const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Transaccion extends Model {
    /**
     * Asociaciones del modelo Transaccion.
     *
     * Patrón especial: dos belongsTo hacia Cuenta (origen y destino)
     * y uno hacia Usuario (aprobador). Se usan alias obligatorios
     * ya que hay múltiples FK apuntando a la misma tabla.
     *
     * @param {object} models - Todos los modelos cargados
     */
    static associate(models) {
      // Tipo de operación realizada (N:1)
      Transaccion.belongsTo(models.TipoTransaccion, {
        foreignKey: 'tipo_transaccion_id',
        as: 'tipoTransaccion',
      });

      // Cuenta debitada — puede ser NULL en depósitos directos (N:1)
      Transaccion.belongsTo(models.Cuenta, {
        foreignKey: 'cuenta_origen_id',
        as: 'cuentaOrigen',
      });

      // Cuenta acreditada — puede ser NULL en retiros directos (N:1)
      Transaccion.belongsTo(models.Cuenta, {
        foreignKey: 'cuenta_destino_id',
        as: 'cuentaDestino',
      });

      // Supervisor que autorizó la transacción — NULL si no requirió aprobación (N:1)
      Transaccion.belongsTo(models.Usuario, {
        foreignKey: 'aprobado_por',
        as: 'aprobador',
      });

      // Auto-referencia: transacción original que esta revierte (N:1)
      Transaccion.belongsTo(models.Transaccion, {
        foreignKey: 'transaccion_origen_id',
        as: 'transaccionOrigen',
      });

      // Inversamente: reversiones generadas por esta transacción (1:N)
      Transaccion.hasMany(models.Transaccion, {
        foreignKey: 'transaccion_origen_id',
        as: 'reversiones',
      });
    }
  }

  Transaccion.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      tipo_transaccion_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: 'Se requiere el tipo de transacción.' },
        },
      },
      cuenta_origen_id: {
        // NULL válido: los depósitos directos no tienen cuenta de origen
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      cuenta_destino_id: {
        // NULL válido: los retiros directos no tienen cuenta de destino
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      monto: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        validate: {
          isDecimal: { msg: 'El monto debe ser un número decimal.' },
          min: { args: [0.01], msg: 'El monto debe ser mayor a 0.' },
        },
      },
      comision: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0.00,
        validate: {
          isDecimal: { msg: 'La comisión debe ser un número decimal.' },
          min: { args: [0], msg: 'La comisión no puede ser negativa.' },
        },
      },
      monto_total: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        validate: {
          isDecimal: { msg: 'El monto total debe ser un número decimal.' },
          min: { args: [0.01], msg: 'El monto total debe ser mayor a 0.' },
          // Valida que monto_total = monto + comision
          esSumaCorrecta(value) {
            const monto = parseFloat(this.monto) || 0;
            const comision = parseFloat(this.comision) || 0;
            const total = parseFloat(value);
            if (Math.abs(total - (monto + comision)) > 0.001) {
              throw new Error('El monto total debe ser igual a monto + comisión.');
            }
          },
        },
      },
      referencia: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: {
          name: 'uk_transacciones_referencia',
          msg: 'Ya existe una transacción con esa referencia.',
        },
        validate: {
          notEmpty: { msg: 'La referencia de la transacción no puede estar vacía.' },
        },
      },
      descripcion: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      estado: {
        type: DataTypes.ENUM('pendiente', 'completada', 'rechazada', 'reversada'),
        allowNull: false,
        defaultValue: 'pendiente',
        validate: {
          isIn: {
            args: [['pendiente', 'completada', 'rechazada', 'reversada']],
            msg: 'El estado debe ser "pendiente", "completada", "rechazada" o "reversada".',
          },
        },
      },
      aprobado_por: {
        // NULL si la transacción no requirió aprobación de supervisor
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      fecha_aprobacion: {
        type: DataTypes.DATE,
        allowNull: true,
        validate: {
          isDate: { msg: 'La fecha de aprobación debe ser una fecha válida.' },
        },
      },
      transaccion_origen_id: {
        // Auto-referencia para el flujo de reversiones bancarias
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Transaccion',
      tableName: 'transacciones',
      timestamps: true,
      freezeTableName: true,
    }
  );

  return Transaccion;
};
