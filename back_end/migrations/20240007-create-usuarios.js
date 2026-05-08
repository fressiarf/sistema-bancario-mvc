'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('usuarios', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      rol_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: 'FK al rol del usuario en el sistema',
        references: {
          model: 'roles',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      nombre_completo: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(150),
        allowNull: false,
        unique: true,
        comment: 'Email unico, utilizado como identificador de acceso',
      },
      telefono: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      contrasenia_hash: {
        type: Sequelize.STRING(255),
        allowNull: false,
        comment: 'Hash bcrypt de la contrasenia. Nunca se almacena texto plano',
      },
      intentos_fallidos: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Contador de intentos de acceso fallidos. Mecanismo antifraude',
      },
      bloqueado_hasta: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'Marca temporal hasta la que el usuario esta temporalmente bloqueado',
      },
      estado: {
        type: Sequelize.ENUM('activo', 'bloqueado', 'suspendido'),
        allowNull: false,
        defaultValue: 'activo',
        comment: 'Ciclo de vida del usuario. Borrado logico mediante este campo',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('usuarios');
  },
};
