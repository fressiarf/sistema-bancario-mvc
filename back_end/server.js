require('dotenv').config(); // Carga las variables de entorno

const { connectDB } = require('./database');
const app = require('./index'); // Importamos la aplicación configurada

const PORT = process.env.PORT || 3000;

// Inicialización del servidor
const startServer = async () => {
  try {
    await connectDB(); // Verifica la conexión a la BD
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
      console.log('Documentación de la API: /api');
    });
  } catch (error) {
    console.error('No se pudo iniciar el servidor:', error.message);
    process.exit(1);
  }
};

startServer();
