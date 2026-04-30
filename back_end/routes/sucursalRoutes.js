const express = require('express');
const router = express.Router();
const sucursalController = require('../controllers/sucursalController');

router.get('/', sucursalController.findAll);
router.get('/:id', sucursalController.findByPk);
router.post('/', sucursalController.create);
router.put('/:id', sucursalController.update);
router.delete('/:id', sucursalController.destroy);

module.exports = router;
