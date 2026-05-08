'use strict';

require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER     || 'root',
    password: process.env.DB_PASSWORD || null,
    database: process.env.DB_NAME     || 'sistema_bancario_mvc',
    host:     process.env.DB_HOST     || 'localhost',
    port:     parseInt(process.env.DB_PORT, 10) || 3306,
    dialect:  'mysql',

    logging: (sql) => console.log(`[SQL] ${sql}`),

    define: {
      timestamps:     true,
      underscored:    false,
      freezeTableName: true,
    },
  },

  test: {
    username: process.env.DB_USER     || 'root',
    password: process.env.DB_PASSWORD || null,
    database: process.env.DB_NAME_TEST || `${process.env.DB_NAME}_test`,
    host:     process.env.DB_HOST     || 'localhost',
    port:     parseInt(process.env.DB_PORT, 10) || 3306,
    dialect:  'mysql',
    logging:  false,

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
    logging:  false,
    pool: {
      max:     10,
      min:     2,
      acquire: 30000,
      idle:    10000,
    },

    define: {
      timestamps:     true,
      underscored:    false,
      freezeTableName: true,
    },
  },
};
