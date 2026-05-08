'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('logs_acceso', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      usuario_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: 'FK al usuario. Nullable: permite registrar intentos de acceso fallidos sin usuario valido',
        references: {
          model: 'usuarios',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      ip: {
        type: Sequelize.STRING(45),
        allowNull: true,
        comment: 'IP desde la que se realizo la accion (soporta IPv6)',
      },
      accion: {
        type: Sequelize.STRING(100),
        allowNull: false,
        comment: 'Descripcion corta de la accion (LOGIN_EXITOSO, LOGIN_FALLIDO, CIERRE_SESION, etc.)',
      },
      descripcion: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Detalle adicional del evento para auditoria',
      },
      exitoso: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        comment: 'Indica si la accion fue exitosa. Critico para detectar ataques de fuerza bruta',
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
    await queryInterface.dropTable('logs_acceso');
  },
};
