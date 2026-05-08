'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('cuentas', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      numero_cuenta: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true,
        comment: 'Numero de cuenta visible para el cliente. Generado por el sistema',
      },
      usuario_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: 'FK al propietario de la cuenta',
        references: {
          model: 'usuarios',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      tipo_cuenta_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: 'FK al tipo de producto financiero (corriente, ahorros, etc.)',
        references: {
          model: 'tipos_cuenta',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      moneda_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: 'FK a la divisa en que esta denominada la cuenta',
        references: {
          model: 'monedas',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      sucursal_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: 'FK a la sucursal donde fue aperturada la cuenta',
        references: {
          model: 'sucursales',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      saldo: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0.00,
        comment: 'Saldo contable total de la cuenta',
      },
      saldo_disponible: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0.00,
        comment: 'Saldo disponible para uso. Puede diferir de saldo si existen fondos retenidos',
      },
      fecha_apertura: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        comment: 'Fecha en que se abrio formalmente la cuenta',
      },
      estado: {
        type: Sequelize.ENUM('activa', 'inactiva', 'bloqueada', 'cerrada'),
        allowNull: false,
        defaultValue: 'activa',
        comment: 'Ciclo de vida de la cuenta. Borrado logico mediante este campo',
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
    await queryInterface.dropTable('cuentas');
  },
};
