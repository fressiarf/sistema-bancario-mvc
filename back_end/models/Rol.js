'use strict';

const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Rol extends Model {
  
    static associate(models) {
      Rol.hasMany(models.Usuario, {
        foreignKey: 'rol_id',
        as: 'usuarios',
      });
    }
  }

  Rol.init(
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
          name: 'uk_roles_nombre',
          msg: 'Ya existe un rol con ese nombre.',
        },
        validate: {
          notEmpty: { msg: 'El nombre del rol no puede estar vacío.' },
          len: { args: [2, 50], msg: 'El nombre debe tener entre 2 y 50 caracteres.' },
        },
      },
      descripcion: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      activa: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: 'Rol',
      tableName: 'roles',
      timestamps: true,
      freezeTableName: true,
    }
  );

  return Rol;
};
