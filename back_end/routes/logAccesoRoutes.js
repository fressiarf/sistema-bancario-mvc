const express = require('express');
const router = express.Router();
const logAccesoController = require('../controllers/logAccesoController');

router.get('/', logAccesoController.findAll);
router.get('/:id', logAccesoController.findByPk);
router.post('/', logAccesoController.create);
router.put('/:id', logAccesoController.update);
router.delete('/:id', logAccesoController.destroy);

module.exports = router;
