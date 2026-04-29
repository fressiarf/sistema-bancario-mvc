'use strict';

/**
 * Re-exportador de modelos.
 *
 * La carga, registro y asociación de modelos se centraliza en database.js.
 * Este archivo existe únicamente para mantener compatibilidad con imports
 * que apunten a la carpeta /models directamente.
 *
 * USO recomendado (fuente de verdad):
 *   const { Usuario, Cuenta } = require('../database');
 *
 * USO alternativo (también válido):
 *   const { Usuario, Cuenta } = require('../models');
 */
module.exports = require('../database');
