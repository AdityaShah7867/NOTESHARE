const Router = require('express');
const { getAllSubjects, addSubjects } = require('../controllers/subCntrl');
const router = Router();

router.route('/').get(getAllSubjects).post(addSubjects);

module.exports = router;