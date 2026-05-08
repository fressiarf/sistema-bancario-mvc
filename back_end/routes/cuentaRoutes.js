const express = require('express');
const router = express.Router();
const cuentaController = require('../controllers/cuentaController');
const { restringirA } = require('../middlewares/roleMiddleware');

const soloAdmin = restringirA('Administrador', 'administrador', 'admin');

router.get('/mis-cuentas', cuentaController.misCuentas);

router.get('/', soloAdmin, cuentaController.findAll);
router.get('/:id', soloAdmin, cuentaController.findByPk);
router.post('/', soloAdmin, cuentaController.create);
router.put('/:id', soloAdmin, cuentaController.update);
router.delete('/:id', soloAdmin, cuentaController.destroy);

module.exports = router;
