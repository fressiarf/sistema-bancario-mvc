'use strict';

const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class TipoCuenta extends Model {
    /**
     * Un tipo de cuenta puede tener múltiples cuentas y múltiples tasas históricas.
     * @param {object} models - Todos los modelos cargados
     */
    static associate(models) {
      TipoCuenta.hasMany(models.Cuenta, {
        foreignKey: 'tipo_cuenta_id',
        as: 'cuentas',
      });
      TipoCuenta.hasMany(models.TasaInteres, {
        foreignKey: 'tipo_cuenta_id',
        as: 'tasas',
      });
    }
  }

  TipoCuenta.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      nombre: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: {
          name: 'uk_tipos_cuenta_nombre',
          msg: 'Ya existe un tipo de cuenta con ese nombre.',
        },
        validate: {
          notEmpty: { msg: 'El nombre del tipo de cuenta no puede estar vacío.' },
        },
      },
      descripcion: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      permite_sobregiro: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      tasa_base: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0.00,
        validate: {
          isDecimal: { msg: 'La tasa base debe ser un número decimal.' },
          min: { args: [0], msg: 'La tasa base no puede ser negativa.' },
        },
      },
      activa: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: 'TipoCuenta',
      tableName: 'tipos_cuenta',
      timestamps: true,
      freezeTableName: true,
    }
  );

  return TipoCuenta;
};
