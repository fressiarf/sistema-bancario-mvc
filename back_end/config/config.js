'use strict';

require('dotenv').config();

/**
 * Configuración de credenciales y opciones de conexión por entorno.
 *
 * Lee desde variables de entorno para mantener los secretos fuera
 * del repositorio. El archivo .env.example documenta las claves requeridas.
 *
 * @module config/config
 */
module.exports = {
  development: {
    username: process.env.DB_USER     || 'root',
    password: process.env.DB_PASSWORD || null,
    database: process.env.DB_NAME     || 'sistema_bancario_mvc',
    host:     process.env.DB_HOST     || 'localhost',
    port:     parseInt(process.env.DB_PORT, 10) || 3306,
    dialect:  'mysql',

    // Muestra las queries SQL generadas en consola (solo desarrollo)
    logging: (sql) => console.log(`[SQL] ${sql}`),

    define: {
      timestamps:     true,   // Agrega createdAt y updatedAt automáticamente
      underscored:    false,   // Respeta los nombres de campo tal cual se definen
      freezeTableName: true,  // Evita que Sequelize pluralice los nombres de tabla
    },
  },

  test: {
    username: process.env.DB_USER     || 'root',
    password: process.env.DB_PASSWORD || null,
    database: process.env.DB_NAME_TEST || `${process.env.DB_NAME}_test`,
    host:     process.env.DB_HOST     || 'localhost',
    port:     parseInt(process.env.DB_PORT, 10) || 3306,
    dialect:  'mysql',
    logging:  false, // Sin ruido en la salida durante tests

    define: {
      timestamps:     true,
      underscored:    false,
      freezeTableName: true,
    },
  },

  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host:     process.env.DB_HOST,
    port:     parseInt(process.env.DB_PORT, 10) || 3306,
    dialect:  'mysql',
    logging:  false, // Sin logs en producción por seguridad y rendimiento

    // Pool de conexiones optimizado para carga real
    pool: {
      max:     10,    // Conexiones activas simultáneas máximas
      min:     2,     // Conexiones mínimas mantenidas calientes
      acquire: 30000, // ms máximos para obtener una conexión del pool
      idle:    10000, // ms antes de liberar una conexión inactiva
    },

    define: {
      timestamps:     true,
      underscored:    false,
      freezeTableName: true,
    },
  },
};
