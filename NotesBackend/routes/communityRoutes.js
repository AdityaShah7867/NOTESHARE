const router = require('express').Router();

const {createCommunity, getAllCommunities, getCommunity, updateCommunity, deleteCommunity, getCommunityInWhichUserIsMember, joinCommunity} = require('../controllers/communityCntrl');

const validateToken = require('../middlewares/validateToken');

router.post('/create', validateToken, createCommunity);
router.get('/getAllCommunities', validateToken, getAllCommunities);
router.get('/getCommunity/:id', validateToken, getCommunity);
router.put('/updateCommunity/:id', validateToken, updateCommunity);
router.delete('/deleteCommunity/:id', validateToken, deleteCommunity);
router.get('/get-your-communities', validateToken, getCommunityInWhichUserIsMember);
router.put('/join-community/:id', validateToken, joinCommunity)

module.exports = router;