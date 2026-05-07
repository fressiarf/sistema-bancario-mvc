const express = require('express');
const router = express.Router();
const rolController = require('../controllers/rolController');
const { restringirA } = require('../middlewares/roleMiddleware');

// Solo el SuperAdministrador (ID 5) puede gestionar roles
router.use(restringirA('SuperAdministrador'));

router.get('/', rolController.findAll);
router.get('/:id', rolController.findByPk);
router.post('/', rolController.create);
router.put('/:id', rolController.update);
router.delete('/:id', rolController.destroy);

module.exports = router;
