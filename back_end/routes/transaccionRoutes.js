const express = require('express');
const router = express.Router();
const transaccionController = require('../controllers/transaccionController');
const { restringirA } = require('../middlewares/roleMiddleware');

const soloAdmin = restringirA('Administrador', 'administrador', 'admin');

// Cualquier autenticado puede hacer transferencias
router.post('/transferencia', transaccionController.realizarTransferencia);

// CRUD completo solo para admin
router.get('/', soloAdmin, transaccionController.findAll);
router.get('/:id', soloAdmin, transaccionController.findByPk);
router.post('/', soloAdmin, transaccionController.create);
router.put('/:id', soloAdmin, transaccionController.update);
router.delete('/:id', soloAdmin, transaccionController.destroy);

module.exports = router;
