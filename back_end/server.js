require('dotenv').config(); // Carga las variables de entorno PRIMERO

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { connectDB } = require('./database'); // Usa la función centralizada de database.js
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors({
  origin: 'http://localhost:5173', // Puerto por defecto de Vite
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas principales
app.use('/api', routes);

// Endpoint de bienvenida
app.get('/', (req, res) => {
  res.json({ message: 'Bienvenido a la API del Sistema Bancario MVC' });
});

// Middleware de manejo de errores globales
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Ha ocurrido un error interno en el servidor.',
    error: err.message
  });
});

// Inicialización del servidor
const startServer = async () => {
  await connectDB(); // Verifica la conexión a la BD (termina el proceso si falla)
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}/api`);
  });
};

startServer();
