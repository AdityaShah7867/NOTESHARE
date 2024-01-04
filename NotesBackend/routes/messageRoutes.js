const router = require('express').Router();

const { createMessage, getCommunityMessages } = require('../controllers/messageCntrl');
const validateToken = require('../middlewares/validateToken')


router.post('/create', validateToken, createMessage);
router.get('/getCommunityMessages/:id', validateToken, getCommunityMessages);


module.exports = router;