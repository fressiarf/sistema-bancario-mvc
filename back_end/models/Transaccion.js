'use strict';

const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Transaccion extends Model {

    static associate(models) {

      Transaccion.belongsTo(models.TipoTransaccion, {
        foreignKey: 'tipo_transaccion_id',
        as: 'tipoTransaccion',
      });

      Transaccion.belongsTo(models.Cuenta, {
        foreignKey: 'cuenta_origen_id',
        as: 'cuentaOrigen',
      });

      Transaccion.belongsTo(models.Cuenta, {
        foreignKey: 'cuenta_destino_id',
        as: 'cuentaDestino',
      });

      Transaccion.belongsTo(models.Usuario, {
        foreignKey: 'aprobado_por',
        as: 'aprobador',
      });

      Transaccion.belongsTo(models.Transaccion, {
        foreignKey: 'transaccion_origen_id',
        as: 'transaccionOrigen',
      });

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

        type: DataTypes.INTEGER,
        allowNull: true,
      },
      cuenta_destino_id: {

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
