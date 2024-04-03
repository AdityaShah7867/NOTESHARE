const Router = require('express');
const { getAllSubjects, addSubjects } = require('../controllers/subCntrl');
const router = Router();
const validateToken = require('../middlewares/validateToken');

router.route('/').get(validateToken, getAllSubjects).post(addSubjects);

module.exports = router;