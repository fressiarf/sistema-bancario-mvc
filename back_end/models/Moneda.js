'use strict';

const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Moneda extends Model {

    static associate(models) {
      Moneda.hasMany(models.Cuenta, {
        foreignKey: 'moneda_id',
        as: 'cuentas',
      });
    }
  }

  Moneda.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      codigo: {
        type: DataTypes.STRING(10),
        allowNull: false,
        unique: {
          name: 'uk_monedas_codigo',
          msg: 'Ya existe una moneda con ese código ISO.',
        },
        validate: {
          notEmpty: { msg: 'El código de la moneda no puede estar vacío.' },
          isUppercase: { msg: 'El código de la moneda debe estar en mayúsculas (ej. USD, EUR).' },
        },
      },
      nombre: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
          notEmpty: { msg: 'El nombre de la moneda no puede estar vacío.' },
        },
      },
      simbolo: {
        type: DataTypes.STRING(5),
        allowNull: true,
      },
      tasa_cambio_usd: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 1.00,
        validate: {
          isDecimal: { msg: 'La tasa de cambio debe ser un número decimal.' },
          min: { args: [0.000001], msg: 'La tasa de cambio debe ser mayor a 0.' },
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
      modelName: 'Moneda',
      tableName: 'monedas',
      timestamps: true,
      freezeTableName: true,
    }
  );

  return Moneda;
};
