const express = require('express');
const router = express.Router();
const tipoTransaccionController = require('../controllers/tipoTransaccionController');
const { restringirA } = require('../middlewares/roleMiddleware');

const soloAdmin = restringirA('Administrador', 'administrador', 'admin');

router.get('/', tipoTransaccionController.findAll);
router.get('/:id', tipoTransaccionController.findByPk);
router.post('/', soloAdmin, tipoTransaccionController.create);
router.put('/:id', soloAdmin, tipoTransaccionController.update);
router.delete('/:id', soloAdmin, tipoTransaccionController.destroy);

module.exports = router;
