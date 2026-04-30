const express = require('express');
const router = express.Router();
const tipoCuentaController = require('../controllers/tipoCuentaController');

router.get('/', tipoCuentaController.findAll);
router.get('/:id', tipoCuentaController.findByPk);
router.post('/', tipoCuentaController.create);
router.put('/:id', tipoCuentaController.update);
router.delete('/:id', tipoCuentaController.destroy);

module.exports = router;
