const express = require('express')
const router = express.Router()


const {getSummary} = require('../controllers/pdfController')

router.route('/summary').post(getSummary)

module.exports = router 