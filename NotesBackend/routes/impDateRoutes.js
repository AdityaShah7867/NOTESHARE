const express = require('express')

const router = express.Router()

const { creatImpDate, getImpDates } = require('../controllers/impDateCntrl')

const validateToken = require('../middlewares/validateToken')

router.post('/create', validateToken, creatImpDate)

router.get('/get', getImpDates)

module.exports = router;

