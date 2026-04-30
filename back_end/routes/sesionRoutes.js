const express = require('express');
const router = express.Router();
const sesionController = require('../controllers/sesionController');

router.get('/', sesionController.findAll);
router.get('/:id', sesionController.findByPk);
router.post('/', sesionController.create);
router.put('/:id', sesionController.update);
router.delete('/:id', sesionController.destroy);

module.exports = router;
