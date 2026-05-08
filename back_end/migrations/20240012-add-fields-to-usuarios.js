'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('usuarios', 'identificacion', {
      type: Sequelize.STRING(20),
      allowNull: true,
      unique: true,
      after: 'rol_id'
    });
    await queryInterface.addColumn('usuarios', 'puesto', {
      type: Sequelize.STRING(100),
      allowNull: true,
      after: 'nombre_completo'
    });
    await queryInterface.addColumn('usuarios', 'direccion', {
      type: Sequelize.TEXT,
      allowNull: true,
      after: 'telefono'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('usuarios', 'identificacion');
    await queryInterface.removeColumn('usuarios', 'puesto');
    await queryInterface.removeColumn('usuarios', 'direccion');
  }
};
