'use strict';

const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Cuenta extends Model {

    static associate(models) {

      Cuenta.belongsTo(models.Usuario, {
        foreignKey: 'usuario_id',
        as: 'propietario',
      });

      Cuenta.belongsTo(models.TipoCuenta, {
        foreignKey: 'tipo_cuenta_id',
        as: 'tipoCuenta',
      });

      Cuenta.belongsTo(models.Moneda, {
        foreignKey: 'moneda_id',
        as: 'moneda',
      });

      Cuenta.belongsTo(models.Sucursal, {
        foreignKey: 'sucursal_id',
        as: 'sucursal',
      });

      Cuenta.hasMany(models.Transaccion, {
        foreignKey: 'cuenta_origen_id',
        as: 'transaccionesOrigen',
      });

      Cuenta.hasMany(models.Transaccion, {
        foreignKey: 'cuenta_destino_id',
        as: 'transaccionesDestino',
      });
    }
  }

  Cuenta.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      numero_cuenta: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: {
          name: 'uk_cuentas_numero',
          msg: 'El número de cuenta ya existe en el sistema.',
        },
        validate: {
          notEmpty: { msg: 'El número de cuenta no puede estar vacío.' },
        },
      },
      usuario_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: 'Se requiere el propietario de la cuenta.' },
        },
      },
      tipo_cuenta_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: 'Se requiere el tipo de cuenta.' },
        },
      },
      moneda_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: 'Se requiere la moneda de la cuenta.' },
        },
      },
      sucursal_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: 'Se requiere la sucursal de apertura.' },
        },
      },
      saldo: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0.00,
        validate: {
          isDecimal: { msg: 'El saldo debe ser un número decimal.' },
        },
      },
      saldo_disponible: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0.00,
        validate: {
          isDecimal: { msg: 'El saldo disponible debe ser un número decimal.' },
        },
      },
      fecha_apertura: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
          isDate: { msg: 'La fecha de apertura debe ser una fecha válida.' },
        },
      },
      estado: {
        type: DataTypes.ENUM('activa', 'inactiva', 'bloqueada', 'cerrada'),
        allowNull: false,
        defaultValue: 'activa',
        validate: {
          isIn: {
            args: [['activa', 'inactiva', 'bloqueada', 'cerrada']],
            msg: 'El estado debe ser "activa", "inactiva", "bloqueada" o "cerrada".',
          },
        },
      },
    },
    {
      sequelize,
      modelName: 'Cuenta',
      tableName: 'cuentas',
      timestamps: true,
      freezeTableName: true,
    }
  );

  return Cuenta;
};
