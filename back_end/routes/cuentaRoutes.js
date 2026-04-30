const express = require('express');
const router = express.Router();
const cuentaController = require('../controllers/cuentaController');

router.get('/', cuentaController.findAll);
router.get('/:id', cuentaController.findByPk);
router.post('/', cuentaController.create);
router.put('/:id', cuentaController.update);
router.delete('/:id', cuentaController.destroy);

module.exports = router;
