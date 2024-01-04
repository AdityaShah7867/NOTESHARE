const router = require('express').Router();

const {createCommunity, getAllCommunities, getCommunity, updateCommunity, deleteCommunity, getCommunityInWhichUserIsMember, joinCommunity, leaveCommunity} = require('../controllers/communityCntrl');
const {profileUpload} = require('../middlewares/upload')
const validateToken = require('../middlewares/validateToken');

router.post('/create', validateToken, profileUpload.single('image'), createCommunity);
router.get('/getAllCommunities', validateToken, getAllCommunities);
router.get('/getCommunity/:id', validateToken, getCommunity);
router.put('/updateCommunity/:id', validateToken, profileUpload.single('image'),  updateCommunity);
router.delete('/deleteCommunity/:id', validateToken, deleteCommunity);
router.get('/get-your-communities', validateToken, getCommunityInWhichUserIsMember);
router.put('/join-community/:id', validateToken, joinCommunity)
router.put('/leave-community/:id', validateToken, leaveCommunity)

module.exports = router;