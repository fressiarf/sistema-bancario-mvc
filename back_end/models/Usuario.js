'use strict';

const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Usuario extends Model {
    /**
     * Asociaciones del modelo Usuario.
     * Un usuario pertenece a un rol y puede tener cuentas, sesiones y logs.
     * @param {object} models - Todos los modelos cargados
     */
    static associate(models) {
      // Pertenece a un rol (N:1)
      Usuario.belongsTo(models.Rol, {
        foreignKey: 'rol_id',
        as: 'rol',
      });

      // Tiene múltiples cuentas bancarias (1:N)
      Usuario.hasMany(models.Cuenta, {
        foreignKey: 'usuario_id',
        as: 'cuentas',
      });

      // Tiene múltiples sesiones activas (1:N, multi-dispositivo)
      Usuario.hasMany(models.Sesion, {
        foreignKey: 'usuario_id',
        as: 'sesiones',
      });

      // Registro de auditoría: eventos de acceso (1:N)
      Usuario.hasMany(models.LogAcceso, {
        foreignKey: 'usuario_id',
        as: 'logs',
      });

      // Transacciones que este usuario ha aprobado como supervisor (1:N)
      Usuario.hasMany(models.Transaccion, {
        foreignKey: 'aprobado_por',
        as: 'transaccionesAprobadas',
      });
    }

    /**
     * Sobrescribe toJSON para excluir contrasenia_hash de las respuestas JSON.
     * Este método se llama automáticamente cuando se serializa la instancia
     * (ej. res.json(usuario)), garantizando que la contraseña nunca salga en la API.
     * @returns {object} Instancia sin el campo contrasenia_hash
     */
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
      nombre_completo: {
        type: DataTypes.STRING(150),
        allowNull: false,
        validate: {
          notEmpty: { msg: 'El nombre completo no puede estar vacío.' },
          len: { args: [2, 150], msg: 'El nombre debe tener entre 2 y 150 caracteres.' },
        },
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
      contrasenia_hash: {
        type: DataTypes.STRING(255),
        allowNull: false,
        // SEGURIDAD: Este campo se excluye de toJSON() y nunca debe retornarse en la API
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
      // Excluye contrasenia_hash de cualquier consulta con defaultScope
      defaultScope: {
        attributes: {
          exclude: ['contrasenia_hash'],
        },
      },
      // Scope especial para cuando sí se necesita la contraseña (ej. login)
      scopes: {
        conContrasenia: {
          attributes: {}, // Incluye todos los campos, sin exclusión
        },
      },
    }
  );

  return Usuario;
};
