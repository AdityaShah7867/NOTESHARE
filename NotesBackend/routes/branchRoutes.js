const Router = require('express');
const { getAllBrnch, addBranch } = require('../controllers/brnchCntrl');
const router = Router();

router.route('/').get(getAllBrnch).post(addBranch);

module.exports = router;