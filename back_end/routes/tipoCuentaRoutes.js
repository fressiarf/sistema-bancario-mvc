const express = require('express');
const router = express.Router();
const tipoCuentaController = require('../controllers/tipoCuentaController');
const { restringirA } = require('../middlewares/roleMiddleware');

const soloAdmin = restringirA('Administrador', 'administrador', 'admin');

router.get('/', tipoCuentaController.findAll);
router.get('/:id', tipoCuentaController.findByPk);
router.post('/', soloAdmin, tipoCuentaController.create);
router.put('/:id', soloAdmin, tipoCuentaController.update);
router.delete('/:id', soloAdmin, tipoCuentaController.destroy);

module.exports = router;
