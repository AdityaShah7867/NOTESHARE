const Router = require('express');
const { getAllModules, addModules } = require('../controllers/modCntrl');
const router = Router();

router.route('/').get(getAllModules).post(addModules);

module.exports = router; 