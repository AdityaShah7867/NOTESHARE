const Router = require('express');
const router = Router();
const { transferCoins, getTransferCoinsHistory, getTransferCoinsHistoryByUser, lottery } = require('../controllers/transfercoinsCntrl');
const validateToken = require('../middlewares/validateToken');

router.post('/transfercoins/:receiverID', validateToken, transferCoins)
router.get('/getAllTransferCoins', validateToken, getTransferCoinsHistory)
router.get('/getTransferCoinsByUser/:userID', validateToken, getTransferCoinsHistoryByUser)
router.post('/lottery', validateToken, lottery)


module.exports = router;
