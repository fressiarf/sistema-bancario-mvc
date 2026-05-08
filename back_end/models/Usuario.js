'use strict';

const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Usuario extends Model {

    static associate(models) {

      Usuario.belongsTo(models.Rol, {
        foreignKey: 'rol_id',
        as: 'rol',
      });

      Usuario.hasMany(models.Cuenta, {
        foreignKey: 'usuario_id',
        as: 'cuentas',
      });

      Usuario.hasMany(models.Sesion, {
        foreignKey: 'usuario_id',
        as: 'sesiones',
      });

      Usuario.hasMany(models.LogAcceso, {
        foreignKey: 'usuario_id',
        as: 'logs',
      });

      Usuario.hasMany(models.Transaccion, {
        foreignKey: 'aprobado_por',
        as: 'transaccionesAprobadas',
      });
    }
    toJSON() {
      const values = { ...this.get() };
      delete values.contrasenia_hash;
      return values;
    }
  }

  Usuario.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      rol_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: 'Se requiere asignar un rol al usuario.' },
        },
      },
      identificacion: {
        type: DataTypes.STRING(20),
        allowNull: true,
        unique: {
          name: 'uk_usuarios_identificacion',
          msg: 'Ya existe un usuario con esta identificación.'
        }
      },
      nombre_completo: {
        type: DataTypes.STRING(150),
        allowNull: false,
        validate: {
          notEmpty: { msg: 'El nombre completo no puede estar vacío.' },
          len: { args: [2, 150], msg: 'El nombre debe tener entre 2 y 150 caracteres.' },
        },
      },
      puesto: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      email: {
        type: DataTypes.STRING(150),
        allowNull: false,
        unique: {
          name: 'uk_usuarios_email',
          msg: 'Ya existe una cuenta registrada con ese correo electrónico.',
        },
        validate: {
          isEmail: { msg: 'El correo electrónico no tiene un formato válido.' },
          notEmpty: { msg: 'El correo electrónico no puede estar vacío.' },
        },
      },
      telefono: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      direccion: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      contrasenia_hash: {
        type: DataTypes.STRING(255),
        allowNull: false,

        validate: {
          notEmpty: { msg: 'La contraseña no puede estar vacía.' },
        },
      },
      intentos_fallidos: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: { args: [0], msg: 'Los intentos fallidos no pueden ser negativos.' },
        },
      },

      bloqueado_hasta: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      estado: {
        type: DataTypes.ENUM('activo', 'bloqueado', 'suspendido'),
        allowNull: false,
        defaultValue: 'activo',
        validate: {
          isIn: {
            args: [['activo', 'bloqueado', 'suspendido']],
            msg: 'El estado debe ser "activo", "bloqueado" o "suspendido".',
          },
        },
      },
    },
    {
      sequelize,
      modelName: 'Usuario',
      tableName: 'usuarios',
      timestamps: true,
      freezeTableName: true,

      defaultScope: {
        attributes: {
          exclude: ['contrasenia_hash'],
        },
      },

      scopes: {
        conContrasenia: {
          attributes: {},
        },
      },
    }
  );

  return Usuario;
};
