const express = require('express');
const router = express.Router();
const rolController = require('../controllers/rolController');
const { restringirA } = require('../middlewares/roleMiddleware');

// Solo los Administradores pueden gestionar roles
router.use(restringirA('administrador', 'admin', 'Admin', 'Administrador'));

router.get('/', rolController.findAll);
router.get('/:id', rolController.findByPk);
router.post('/', rolController.create);
router.put('/:id', rolController.update);
router.delete('/:id', rolController.destroy);

module.exports = router;
