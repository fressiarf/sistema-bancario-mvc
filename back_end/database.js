'use strict';

const fs        = require('fs');
const path      = require('path');
const { Sequelize } = require('sequelize');
const config    = require('./config/config');

// ─── Entorno activo ──────────────────────────────────────────────────────────
const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

// ─── Instancia Sequelize (Singleton) ────────────────────────────────────────
/**
 * Única instancia de Sequelize para toda la aplicación.
 * Se reutiliza en todos los modelos, controllers y servicios.
 */
const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  dbConfig
);

// ─── Carga dinámica de modelos ───────────────────────────────────────────────
/**
 * Lee automáticamente todos los archivos .js de la carpeta /models
 * (excepto index.js) y los registra pasándoles la instancia de sequelize.
 *
 * Ventaja: al agregar un nuevo modelo a /models, se registra solo,
 * sin necesidad de modificar este archivo.
 */
const modelsDir = path.join(__dirname, 'models');
const db = {};

fs
  .readdirSync(modelsDir)
  .filter((file) => {
    return (
      file.endsWith('.js') &&       // Solo archivos JS
      file !== 'index.js' &&        // Excluye el index re-exportador
      !file.startsWith('.')         // Excluye archivos ocultos
    );
  })
  .forEach((file) => {
    // Cada modelo es una función factory que recibe la instancia de Sequelize
    const modelFactory = require(path.join(modelsDir, file));
    const model = modelFactory(sequelize);
    db[model.name] = model; // Se indexa por el nombre del modelo (ej: 'Usuario')
  });

// ─── Ejecución de asociaciones ───────────────────────────────────────────────
/**
 * Una vez que TODOS los modelos están registrados en db{},
 * se ejecutan las asociaciones. El orden importa: debe hacerse
 * después de cargar todos los modelos para evitar referencias indefinidas.
 */
Object.values(db).forEach((model) => {
  if (typeof model.associate === 'function') {
    model.associate(db);
  }
});

// ─── Verificación de conexión ────────────────────────────────────────────────
/**
 * Autentica la conexión con MySQL. Llama a esta función al iniciar el servidor.
 * Termina el proceso si la base de datos no responde — el servidor no debe
 * arrancar sin garantía de conectividad con la BD.
 *
 * @returns {Promise<void>}
 */
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log(`✅ [Database] Conexión a MySQL establecida [entorno: ${env}]`);
  } catch (error) {
    console.error('❌ [Database] Error al conectar con MySQL:', error.message);
    process.exit(1);
  }
};

// ─── Exportaciones ───────────────────────────────────────────────────────────
/**
 * Se exporta el mapa completo de modelos + la instancia sequelize + connectDB.
 *
 * USO en controllers/servicios:
 *   const { Usuario, Cuenta, Transaccion } = require('../database');
 *
 * USO para transacciones manuales:
 *   const { sequelize } = require('../database');
 *   const t = await sequelize.transaction();
 */
module.exports = {
  sequelize,
  connectDB,
  ...db,
};
