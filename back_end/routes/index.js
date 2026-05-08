const express = require('express');
const router = express.Router();

const { verificarToken } = require('../middlewares/authMiddleware');
const { restringirA } = require('../middlewares/roleMiddleware');

const authRoutes = require('./authRoutes');
const rolRoutes = require('./rolRoutes');
const sucursalRoutes = require('./sucursalRoutes');
const monedaRoutes = require('./monedaRoutes');
const tipoCuentaRoutes = require('./tipoCuentaRoutes');
const tipoTransaccionRoutes = require('./tipoTransaccionRoutes');
const tasaInteresRoutes = require('./tasaInteresRoutes');
const usuarioRoutes = require('./usuarioRoutes');
const cuentaRoutes = require('./cuentaRoutes');
const logAccesoRoutes = require('./logAccesoRoutes');
const sesionRoutes = require('./sesionRoutes');
const transaccionRoutes = require('./transaccionRoutes');

router.use('/auth', authRoutes);

router.use(verificarToken);

router.use((req, res, next) => {
  if (req.method === 'DELETE') {
    return restringirA('SuperAdministrador', 'Administrador', 'administrador', 'admin')(req, res, next);
  }
  next();
});

router.use('/roles', rolRoutes);
router.use('/sucursales', sucursalRoutes);
router.use('/monedas', monedaRoutes);
router.use('/tipos-cuenta', tipoCuentaRoutes);
router.use('/tipos-transaccion', tipoTransaccionRoutes);
router.use('/tasas-interes', tasaInteresRoutes);
router.use('/usuarios', usuarioRoutes);
router.use('/cuentas', cuentaRoutes);
router.use('/logs-acceso', logAccesoRoutes);
router.use('/sesiones', sesionRoutes);
router.use('/transacciones', transaccionRoutes);

module.exports = router;
