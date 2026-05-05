const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Ruta pública para iniciar sesión
router.post('/login', authController.login);

module.exports = router;
