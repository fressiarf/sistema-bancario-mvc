'use strict';

const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Sucursal extends Model {

    static associate(models) {
      Sucursal.hasMany(models.Cuenta, {
        foreignKey: 'sucursal_id',
        as: 'cuentas',
      });
    }
  }

  Sucursal.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: { msg: 'El nombre de la sucursal no puede estar vacío.' },
        },
      },
      direccion: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      ciudad: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      telefono: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      estado: {
        type: DataTypes.ENUM('activa', 'inactiva'),
        allowNull: false,
        defaultValue: 'activa',
        validate: {
          isIn: {
            args: [['activa', 'inactiva']],
            msg: 'El estado debe ser "activa" o "inactiva".',
          },
        },
      },
    },
    {
      sequelize,
      modelName: 'Sucursal',
      tableName: 'sucursales',
      timestamps: true,
      freezeTableName: true,
    }
  );

  return Sucursal;
};
