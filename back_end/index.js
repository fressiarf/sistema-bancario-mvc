const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const routes = require('./routes');

const app = express();

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

// Exportamos la app para que pueda ser usada en server.js y en los tests
module.exports = app;
