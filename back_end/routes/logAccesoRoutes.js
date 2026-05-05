const express = require('express');
const router = express.Router();
const logAccesoController = require('../controllers/logAccesoController');
const { restringirA } = require('../middlewares/roleMiddleware');

const soloAdmin = restringirA('Administrador', 'administrador', 'admin');

// Solo admin puede ver y gestionar logs de auditoría
router.use(soloAdmin);

router.get('/', logAccesoController.findAll);
router.get('/:id', logAccesoController.findByPk);
router.post('/', logAccesoController.create);
router.put('/:id', logAccesoController.update);
router.delete('/:id', logAccesoController.destroy);

module.exports = router;
