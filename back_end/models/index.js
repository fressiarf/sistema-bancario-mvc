'use strict';

const { sequelize } = require('../db');

/**
 * Punto de entrada de todos los modelos Sequelize.
 *
 * Este archivo:
 * 1. Importa y registra cada modelo pasándole la instancia de sequelize.
 * 2. Ejecuta el método static associate() de cada modelo para definir
 *    todas las relaciones entre tablas.
 * 3. Exporta un objeto centralizado con todos los modelos listos para usar
 *    desde controllers y servicios.
 *
 * USO:
 *   const { Usuario, Cuenta, Transaccion } = require('./models');
 */

// ─── Importación y registro de modelos ──────────────────────────────────────
const Rol            = require('./Rol')(sequelize);
const Sucursal       = require('./Sucursal')(sequelize);
const Moneda         = require('./Moneda')(sequelize);
const TipoCuenta     = require('./TipoCuenta')(sequelize);
const TipoTransaccion = require('./TipoTransaccion')(sequelize);
const TasaInteres    = require('./TasaInteres')(sequelize);
const Usuario        = require('./Usuario')(sequelize);
const Sesion         = require('./Sesion')(sequelize);
const LogAcceso      = require('./LogAcceso')(sequelize);
const Cuenta         = require('./Cuenta')(sequelize);
const Transaccion    = require('./Transaccion')(sequelize);

// ─── Mapa de todos los modelos ───────────────────────────────────────────────
const models = {
  Rol,
  Sucursal,
  Moneda,
  TipoCuenta,
  TipoTransaccion,
  TasaInteres,
  Usuario,
  Sesion,
  LogAcceso,
  Cuenta,
  Transaccion,
};

// ─── Ejecución de asociaciones ───────────────────────────────────────────────
// Se itera sobre todos los modelos y se llama a associate() si existe,
// pasando el mapa completo para que cada modelo pueda referenciar a los demás.
Object.values(models).forEach((model) => {
  if (typeof model.associate === 'function') {
    model.associate(models);
  }
});

// ─── Exportaciones ───────────────────────────────────────────────────────────
module.exports = {
  sequelize, // Expone la instancia para transacciones manuales si se necesita
  ...models,
};
