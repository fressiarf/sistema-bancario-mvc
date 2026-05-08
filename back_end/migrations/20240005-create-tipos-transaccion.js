'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tipos_transaccion', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      nombre: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Ej: deposito, retiro, transferencia, pago_servicio, reversion',
      },
      descripcion: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      requiere_aprobacion: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Si es true, la transaccion queda pendiente hasta ser autorizada por un supervisor',
      },
      activa: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Borrado logico del tipo de transaccion',
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
    await queryInterface.dropTable('tipos_transaccion');
  },
};
