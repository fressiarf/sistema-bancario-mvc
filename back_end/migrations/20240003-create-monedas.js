'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('monedas', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      codigo: {
        type: Sequelize.STRING(10),
        allowNull: false,
        unique: true,
        comment: 'Codigo ISO de la moneda (USD, EUR, GTQ, etc.)',
      },
      nombre: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      simbolo: {
        type: Sequelize.STRING(5),
        allowNull: true,
        comment: 'Simbolo visual de la moneda ($, €, Q)',
      },
      tasa_cambio_usd: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 1.00,
        comment: 'Tasa de conversion respecto al dolar para calculos multi-divisa',
      },
      activa: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Borrado logico: false desactiva la moneda sin eliminarla',
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
    await queryInterface.dropTable('monedas');
  },
};
