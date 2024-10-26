const express = require('express');
const router = express.Router();
const {
    createSolvedproblems,
    getsolvedproblemsByUserId
} = require('../controllers/solvedproblemsCntrl');
const validateToken = require('../middlewares/validateToken');

//add solvedproblems post req with middleware
router.route('/addSolvedproblems').post(validateToken, createSolvedproblems);

//to get all solvedproblems of a user
router.route('/getSolvedproblemsByUserId').get(validateToken, getsolvedproblemsByUserId);

module.exports = router;