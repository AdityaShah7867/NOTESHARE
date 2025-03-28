const Router = require('express');
const router = Router();
const { generateUserReport } = require('../controllers/reportCntrl');
const validateToken = require('../middlewares/validateToken');

// Generate user activity report
router.route('/generate/:userId').get( generateUserReport);

module.exports = router;
