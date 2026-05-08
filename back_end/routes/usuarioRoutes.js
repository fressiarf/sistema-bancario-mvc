const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { restringirA } = require('../middlewares/roleMiddleware');

const soloAdmin = restringirA('Administrador', 'administrador', 'admin', 'SuperAdministrador');
const adminYEmpleado = restringirA('Administrador', 'administrador', 'admin', 'Empleado', 'empleado', 'SuperAdministrador');

router.get('/mi-perfil', usuarioController.miPerfil);

router.get('/', soloAdmin, usuarioController.findAll);
router.get('/:id', soloAdmin, usuarioController.findByPk);
router.post('/', adminYEmpleado, usuarioController.create);
router.put('/:id', soloAdmin, usuarioController.update);
router.delete('/:id', soloAdmin, usuarioController.destroy);

module.exports = router;
