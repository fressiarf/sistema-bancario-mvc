'use strict';

const fs        = require('fs');
const path      = require('path');
const { Sequelize } = require('sequelize');
const config    = require('./config/config');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  dbConfig
);

const modelsDir = path.join(__dirname, 'models');
const db = {};

fs
  .readdirSync(modelsDir)
  .filter((file) => {
    return (
      file.endsWith('.js') &&
      file !== 'index.js' &&
      !file.startsWith('.')
    );
  })
  .forEach((file) => {

    const modelFactory = require(path.join(modelsDir, file));
    const model = modelFactory(sequelize);
    db[model.name] = model;
  });

Object.values(db).forEach((model) => {
  if (typeof model.associate === 'function') {
    model.associate(db);
  }
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log(`[Database] Conexión a MySQL establecida [entorno: ${env}]`);
  } catch (error) {
    console.error('[Database] Error al conectar con MySQL:', error.message);
    process.exit(1);
  }
};

module.exports = {
  sequelize,
  connectDB,
  ...db,
};
