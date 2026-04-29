'use strict';

const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class TasaInteres extends Model {
    /**
     * Cada tasa pertenece a un tipo de cuenta específico.
     * @param {object} models - Todos los modelos cargados
     */
    static associate(models) {
      TasaInteres.belongsTo(models.TipoCuenta, {
        foreignKey: 'tipo_cuenta_id',
        as: 'tipoCuenta',
      });
    }
  }

  TasaInteres.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      tipo_cuenta_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: 'Se requiere el tipo de cuenta.' },
        },
      },
      tasa: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        validate: {
          isDecimal: { msg: 'La tasa debe ser un número decimal.' },
          min: { args: [0], msg: 'La tasa no puede ser negativa.' },
          max: { args: [100], msg: 'La tasa no puede superar el 100%.' },
        },
      },
      fecha_ini: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
          isDate: { msg: 'La fecha de inicio debe ser una fecha válida.' },
        },
      },
      fecha_fin: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        validate: {
          isDate: { msg: 'La fecha de fin debe ser una fecha válida.' },
          // Valida que fecha_fin sea posterior a fecha_ini si está presente
          esPosteriorAInicio(value) {
            if (value && this.fecha_ini && value <= this.fecha_ini) {
              throw new Error('La fecha de fin debe ser posterior a la fecha de inicio.');
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
      modelName: 'TasaInteres',
      tableName: 'tasas_interes',
      timestamps: true,
      freezeTableName: true,
    }
  );

  return TasaInteres;
};
