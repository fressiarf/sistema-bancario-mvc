'use strict';

const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class LogAcceso extends Model {
    /**
     * Cada log puede estar asociado a un usuario (nullable para intentos fallidos).
     * IMPORTANTE: Esta tabla es append-only. Nunca debe actualizarse ni eliminarse.
     * @param {object} models - Todos los modelos cargados
     */
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
        // Nullable: permite registrar intentos de acceso con credenciales inválidas
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
