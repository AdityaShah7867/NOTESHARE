const Router = require('express');
const { createComment, getCommentsByNoteId } = require('../controllers/commentCntrl')
const validateToken = require('../middlewares/validateToken')
const router = Router();


router.post('/createComment/:noteId', validateToken, createComment)
router.get('/getCommentsByNoteId/:noteId', validateToken, getCommentsByNoteId)

module.exports = router;