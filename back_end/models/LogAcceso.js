'use strict';

const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class LogAcceso extends Model {

    static associate(models) {
      LogAcceso.belongsTo(models.Usuario, {
        foreignKey: 'usuario_id',
        as: 'usuario',
      });
    }
  }

  LogAcceso.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      usuario_id: {

        type: DataTypes.INTEGER,
        allowNull: true,
      },
      ip: {
        type: DataTypes.STRING(45),
        allowNull: true,
        validate: {
          isIP: { msg: 'La dirección IP no tiene un formato válido.' },
        },
      },
      accion: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: { msg: 'La acción del log no puede estar vacía.' },
        },
      },
      descripcion: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      exitoso: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        validate: {
          notNull: { msg: 'Se debe indicar si la acción fue exitosa o no.' },
        },
      },
    },
    {
      sequelize,
      modelName: 'LogAcceso',
      tableName: 'logs_acceso',
      timestamps: true,
      freezeTableName: true,
    }
  );

  return LogAcceso;
};
