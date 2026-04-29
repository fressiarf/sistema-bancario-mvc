'use strict';

const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Cuenta extends Model {
    /**
     * Asociaciones del modelo Cuenta.
     * Punto central del sistema: conecta con usuarios, catálogos y transacciones.
     * @param {object} models - Todos los modelos cargados
     */
    static associate(models) {
      // Propietario de la cuenta (N:1)
      Cuenta.belongsTo(models.Usuario, {
        foreignKey: 'usuario_id',
        as: 'propietario',
      });

      // Tipo de producto financiero (N:1)
      Cuenta.belongsTo(models.TipoCuenta, {
        foreignKey: 'tipo_cuenta_id',
        as: 'tipoCuenta',
      });

      // Divisa en la que está denominada (N:1)
      Cuenta.belongsTo(models.Moneda, {
        foreignKey: 'moneda_id',
        as: 'moneda',
      });

      // Sucursal donde fue aperturada (N:1)
      Cuenta.belongsTo(models.Sucursal, {
        foreignKey: 'sucursal_id',
        as: 'sucursal',
      });

      // Transacciones donde esta cuenta es el ORIGEN del débito (1:N)
      Cuenta.hasMany(models.Transaccion, {
        foreignKey: 'cuenta_origen_id',
        as: 'transaccionesOrigen',
      });

      // Transacciones donde esta cuenta es el DESTINO del crédito (1:N)
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
