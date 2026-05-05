const express = require('express');
const router = express.Router();
const sucursalController = require('../controllers/sucursalController');
const { restringirA } = require('../middlewares/roleMiddleware');

const soloAdmin = restringirA('Administrador', 'administrador', 'admin');

router.get('/', sucursalController.findAll);
router.get('/:id', sucursalController.findByPk);
router.post('/', soloAdmin, sucursalController.create);
router.put('/:id', soloAdmin, sucursalController.update);
router.delete('/:id', soloAdmin, sucursalController.destroy);

module.exports = router;
