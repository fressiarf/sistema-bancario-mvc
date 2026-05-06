const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { restringirA } = require('../middlewares/roleMiddleware');

const soloAdmin = restringirA('Administrador', 'administrador', 'admin');
const adminYEmpleado = restringirA('Administrador', 'administrador', 'admin', 'Empleado', 'empleado');

// Cualquier autenticado puede ver su propio perfil
router.get('/mi-perfil', usuarioController.miPerfil);

// Solo admin puede gestionar usuarios
router.get('/', soloAdmin, usuarioController.findAll);
router.get('/:id', soloAdmin, usuarioController.findByPk);
router.post('/', adminYEmpleado, usuarioController.create);
router.put('/:id', soloAdmin, usuarioController.update);
router.delete('/:id', soloAdmin, usuarioController.destroy);

module.exports = router;
