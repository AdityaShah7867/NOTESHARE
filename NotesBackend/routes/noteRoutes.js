const Router = require('express');
const { filterNote, getFilterdFormData, getBookMarkedNotes, bookMarkNotes, getFormData, getAllNotes, searchNote, addNotes, getSingleNote, deleteNote, getNotesAdmin, AcceptRejectNotes, buyNote } = require('../controllers/noteCntrl');
const validateToken = require('../middlewares/validateToken');
const { upload } = require('../middlewares/upload');
const router = Router();

// Middleware to validate token for all routes under this router


router.route('/').get(validateToken, getAllNotes).post(validateToken, upload.single('file'), addNotes);
// router.route('/:id').get(getSingleNote).delete(deleteNote);
router.route('/getnotesAdmin').get(validateToken, getNotesAdmin);
router.route('/acceptreject/:NoteId').put(validateToken, AcceptRejectNotes);
router.route('/getFormData').get(validateToken, getFormData);
router.get('/getSingleNote/:noteId', validateToken, getSingleNote)
router.delete('/deleteNote/:noteId', validateToken, deleteNote)
router.post('/buyNote/:noteId', validateToken, buyNote)
router.get('/search', validateToken, searchNote)
router.post('/bookmark/:noteId', validateToken, bookMarkNotes)
router.get('/getBookMarkedNotes', validateToken, getBookMarkedNotes)
router.get('/getFilterdFormData', validateToken, getFilterdFormData)
router.get('/filterNote', validateToken, filterNote)


module.exports = router;


