const express = require('express');
const router = express.Router();
const cuentaController = require('../controllers/cuentaController');
const { restringirA } = require('../middlewares/roleMiddleware');

const soloAdmin = restringirA('Administrador', 'administrador', 'admin');

// Ruta para que el usuario vea sus propias cuentas
router.get('/mis-cuentas', cuentaController.misCuentas);

// CRUD completo solo para admin
router.get('/', soloAdmin, cuentaController.findAll);
router.get('/:id', soloAdmin, cuentaController.findByPk);
router.post('/', soloAdmin, cuentaController.create);
router.put('/:id', soloAdmin, cuentaController.update);
router.delete('/:id', soloAdmin, cuentaController.destroy);

module.exports = router;
