const express = require('express');
const router = express.Router();
const tipoTransaccionController = require('../controllers/tipoTransaccionController');

router.get('/', tipoTransaccionController.findAll);
router.get('/:id', tipoTransaccionController.findByPk);
router.post('/', tipoTransaccionController.create);
router.put('/:id', tipoTransaccionController.update);
router.delete('/:id', tipoTransaccionController.destroy);

module.exports = router;
