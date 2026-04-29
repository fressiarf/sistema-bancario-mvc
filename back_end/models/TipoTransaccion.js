'use strict';

const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class TipoTransaccion extends Model {
    /**
     * Un tipo de transacción puede estar en múltiples transacciones.
     * @param {object} models - Todos los modelos cargados
     */
    static associate(models) {
      TipoTransaccion.hasMany(models.Transaccion, {
        foreignKey: 'tipo_transaccion_id',
        as: 'transacciones',
      });
    }
  }

  TipoTransaccion.init(
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
          name: 'uk_tipos_transaccion_nombre',
          msg: 'Ya existe un tipo de transacción con ese nombre.',
        },
        validate: {
          notEmpty: { msg: 'El nombre del tipo de transacción no puede estar vacío.' },
        },
      },
      descripcion: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      requiere_aprobacion: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      activa: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: 'TipoTransaccion',
      tableName: 'tipos_transaccion',
      timestamps: true,
      freezeTableName: true,
    }
  );

  return TipoTransaccion;
};
