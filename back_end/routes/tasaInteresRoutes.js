const express = require('express');
const router = express.Router();
const tasaInteresController = require('../controllers/tasaInteresController');

router.get('/', tasaInteresController.findAll);
router.get('/:id', tasaInteresController.findByPk);
router.post('/', tasaInteresController.create);
router.put('/:id', tasaInteresController.update);
router.delete('/:id', tasaInteresController.destroy);

module.exports = router;
