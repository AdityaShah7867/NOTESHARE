const express = require('express')
const router = express.Router()

const { createSkills, getSkills, removeSkills, getSkillsByUsername } = require('../controllers/skillsCntrl')
const validateToken = require('../middlewares/validateToken')


router.post('/createSkills', validateToken, createSkills)
router.get('/getSkills', validateToken, getSkills)
router.post('/removeSkills', validateToken, removeSkills)
router.get('/getSkills/:username', getSkillsByUsername)

module.exports = router

