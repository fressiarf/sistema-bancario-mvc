const express = require('express');
const router = express.Router();
const monedaController = require('../controllers/monedaController');

router.get('/', monedaController.findAll);
router.get('/:id', monedaController.findByPk);
router.post('/', monedaController.create);
router.put('/:id', monedaController.update);
router.delete('/:id', monedaController.destroy);

module.exports = router;
