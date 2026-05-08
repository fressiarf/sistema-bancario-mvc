const express = require('express');
const router = express.Router();
const transaccionController = require('../controllers/transaccionController');
const { restringirA } = require('../middlewares/roleMiddleware');

const soloAdmin = restringirA('Administrador', 'administrador', 'admin');

router.post('/transferencia', transaccionController.realizarTransferencia);

router.get('/', soloAdmin, transaccionController.findAll);
router.get('/:id', soloAdmin, transaccionController.findByPk);
router.post('/', soloAdmin, transaccionController.create);
router.put('/:id', soloAdmin, transaccionController.update);
router.delete('/:id', soloAdmin, transaccionController.destroy);

module.exports = router;
