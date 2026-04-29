'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('sesiones', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      usuario_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: 'FK al usuario propietario de esta sesion',
        references: {
          model: 'usuarios',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      token: {
        type: Sequelize.STRING(512),
        allowNull: false,
        unique: true,
        comment: 'Token JWT o similar. Unico por sesion activa',
      },
      ip: {
        type: Sequelize.STRING(45),
        allowNull: true,
        comment: 'IP desde la que se inicio la sesion (soporta IPv6)',
      },
      user_agent: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Informacion del navegador o cliente que inicio la sesion',
      },
      fecha_expiracion: {
        type: Sequelize.DATE,
        allowNull: false,
        comment: 'Fecha y hora de expiracion del token. Permite invalidacion remota',
      },
      activa: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'false = sesion cerrada o invalidada. Borrado logico',
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
    await queryInterface.dropTable('sesiones');
  },
};
