const express = require('express');
const router = express.Router();
const monedaController = require('../controllers/monedaController');
const { restringirA } = require('../middlewares/roleMiddleware');

const soloAdmin = restringirA('Administrador', 'administrador', 'admin');

router.get('/', monedaController.findAll);
router.get('/:id', monedaController.findByPk);
router.post('/', soloAdmin, monedaController.create);
router.put('/:id', soloAdmin, monedaController.update);
router.delete('/:id', soloAdmin, monedaController.destroy);

module.exports = router;
