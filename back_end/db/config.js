'use strict';

require('dotenv').config();

/**
 * Configuración de Sequelize por entorno.
 * Lee las credenciales desde variables de entorno (.env) para
 * evitar exponer datos sensibles en el repositorio.
 *
 * sequelize-cli usa este archivo para saber a qué base de datos conectarse
 * al ejecutar migraciones y seeders.
 */
module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    dialect: 'mysql',
    logging: console.log, // Muestra las queries SQL en desarrollo
    define: {
      timestamps: true,       // createdAt y updatedAt automáticos
      underscored: false,     // Mantiene los nombres de campo tal cual
      freezeTableName: true,  // Evita que Sequelize pluralice los nombres de tabla
    },
  },

  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME_TEST || `${process.env.DB_NAME}_test`,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    dialect: 'mysql',
    logging: false, // Sin logs en test para mayor limpieza
    define: {
      timestamps: true,
      underscored: false,
      freezeTableName: true,
    },
  },

  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    dialect: 'mysql',
    logging: false, // Sin logs en produccion por seguridad y rendimiento
    pool: {
      max: 10,        // Máximo de conexiones activas en el pool
      min: 2,         // Mínimo de conexiones mantenidas
      acquire: 30000, // Tiempo máximo (ms) para obtener una conexion antes de lanzar error
      idle: 10000,    // Tiempo (ms) que una conexion puede estar inactiva antes de liberarse
    },
    define: {
      timestamps: true,
      underscored: false,
      freezeTableName: true,
    },
  },
};
