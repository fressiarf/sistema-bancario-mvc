'use strict';

const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Sesion extends Model {
    /**
     * Cada sesión pertenece a un usuario específico.
     * @param {object} models - Todos los modelos cargados
     */
    static associate(models) {
      Sesion.belongsTo(models.Usuario, {
        foreignKey: 'usuario_id',
        as: 'usuario',
      });
    }
  }

  Sesion.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      usuario_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: 'Se requiere el usuario de la sesión.' },
        },
      },
      token: {
        type: DataTypes.STRING(512),
        allowNull: false,
        unique: {
          name: 'uk_sesiones_token',
          msg: 'El token de sesión ya existe.',
        },
        validate: {
          notEmpty: { msg: 'El token no puede estar vacío.' },
        },
      },
      ip: {
        type: DataTypes.STRING(45),
        allowNull: true,
        validate: {
          isIP: { msg: 'La dirección IP no tiene un formato válido.' },
        },
      },
      user_agent: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      fecha_expiracion: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          isDate: { msg: 'La fecha de expiración debe ser una fecha válida.' },
          esFutura(value) {
            if (new Date(value) <= new Date()) {
              throw new Error('La fecha de expiración debe ser una fecha futura.');
            }
          },
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
      modelName: 'Sesion',
      tableName: 'sesiones',
      timestamps: true,
      freezeTableName: true,
    }
  );

  return Sesion;
};
