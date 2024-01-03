const Router = require('express');
const { likeUnlikeNote } = require('../controllers/likeCntrl')
const validateToken = require('../middlewares/validateToken')
const router = Router();


router.post('/likeUnlikeNote/:noteId', validateToken, likeUnlikeNote)


module.exports = router;