'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tasas_interes', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      tipo_cuenta_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: 'FK al tipo de cuenta al que aplica esta tasa historica',
        references: {
          model: 'tipos_cuenta',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      tasa: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
        comment: 'Tasa de interes en porcentaje vigente para el periodo',
      },
      fecha_ini: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        comment: 'Fecha de inicio de vigencia de esta tasa',
      },
      fecha_fin: {
        type: Sequelize.DATEONLY,
        allowNull: true,
        comment: 'Fecha de fin de vigencia. NULL indica que es la tasa actualmente vigente',
      },
      activa: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Borrado logico del registro de tasa',
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
    await queryInterface.dropTable('tasas_interes');
  },
};
