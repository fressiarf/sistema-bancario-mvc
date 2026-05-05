const express = require('express');
const router = express.Router();
const tasaInteresController = require('../controllers/tasaInteresController');
const { restringirA } = require('../middlewares/roleMiddleware');

const soloAdmin = restringirA('Administrador', 'administrador', 'admin');

router.get('/', tasaInteresController.findAll);
router.get('/:id', tasaInteresController.findByPk);
router.post('/', soloAdmin, tasaInteresController.create);
router.put('/:id', soloAdmin, tasaInteresController.update);
router.delete('/:id', soloAdmin, tasaInteresController.destroy);

module.exports = router;
