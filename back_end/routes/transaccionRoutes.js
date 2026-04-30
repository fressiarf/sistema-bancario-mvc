const express = require('express');
const router = express.Router();
const transaccionController = require('../controllers/transaccionController');

// Lógica especial de transferencia
router.post('/transferencia', transaccionController.realizarTransferencia);

// Rutas CRUD estándar
router.get('/', transaccionController.findAll);
router.get('/:id', transaccionController.findByPk);
router.post('/', transaccionController.create);
router.put('/:id', transaccionController.update);
router.delete('/:id', transaccionController.destroy);

module.exports = router;
