'use strict';

const { Sequelize } = require('sequelize');
require('dotenv').config();

const env = process.env.NODE_ENV || 'development';
const config = require('./config')[env];

/**
 * Instancia única de Sequelize (Singleton).
 * Se reutiliza en toda la aplicación para evitar abrir múltiples conexiones.
 * Importar esta instancia desde cualquier modelo o servicio que necesite la BD.
 */
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

/**
 * Verifica la conexión con la base de datos al iniciar el servidor.
 * Llama a esta función desde el punto de entrada (app.js / server.js).
 * @returns {Promise<void>}
 */
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log(`✅ Conexión a MySQL establecida correctamente [${env}]`);
  } catch (error) {
    console.error('❌ No se pudo conectar a la base de datos:', error.message);
    process.exit(1); // Detiene el servidor si la BD no responde al inicio
  }
};

module.exports = { sequelize, connectDB };
