'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('transacciones', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      tipo_transaccion_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: 'FK al tipo de operacion (deposito, retiro, transferencia, etc.)',
        references: {
          model: 'tipos_transaccion',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      cuenta_origen_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: 'FK a la cuenta debitada. NULL en depositos directos',
        references: {
          model: 'cuentas',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      cuenta_destino_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: 'FK a la cuenta acreditada. NULL en retiros directos',
        references: {
          model: 'cuentas',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      monto: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
        comment: 'Monto neto de la operacion sin comisiones',
      },
      comision: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0.00,
        comment: 'Comision cobrada por la operacion',
      },
      monto_total: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
        comment: 'Monto bruto total = monto + comision. Valor real debitado de la cuenta origen',
      },
      referencia: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
        comment: 'Codigo unico de trazabilidad y conciliacion bancaria',
      },
      descripcion: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Detalle o concepto de la transaccion ingresado por el usuario o sistema',
      },
      estado: {
        type: Sequelize.ENUM('pendiente', 'completada', 'rechazada', 'reversada'),
        allowNull: false,
        defaultValue: 'pendiente',
        comment: 'Ciclo de vida de la transaccion. Inmutable una vez completada o reversada',
      },
      aprobado_por: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: 'FK al usuario (supervisor) que autorizo la transaccion. NULL si no requirio aprobacion',
        references: {
          model: 'usuarios',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      fecha_aprobacion: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'Marca temporal de cuando se otorgo la aprobacion',
      },
      transaccion_origen_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: 'Auto-referencia: FK a la transaccion original que se esta revirtiendo',
        references: {
          model: 'transacciones',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
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
    await queryInterface.dropTable('transacciones');
  },
};
