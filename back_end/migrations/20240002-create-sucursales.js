'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('sucursales', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      nombre: {
        type: Sequelize.STRING(100),
        allowNull: false,
        comment: 'Nombre de la sucursal o punto de atencion',
      },
      direccion: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      ciudad: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      telefono: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      estado: {
        type: Sequelize.ENUM('activa', 'inactiva'),
        allowNull: false,
        defaultValue: 'activa',
        comment: 'Borrado logico mediante estado',
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
    await queryInterface.dropTable('sucursales');
  },
};
