
const asyncHandler = require("express-async-handler");
const { User } = require("../models/userModel");
const { TransferCoin } = require('../models/transfercoinModel')



const transferCoins = asyncHandler(async (req, res) => {
    const { receiverID } = req.params;
    try {
        const { coins } = req.body;
        const senderUserID = req.user.id;

        if (receiverID === senderUserID) {
            return res.status(400).json({ message: "You can't transfer coins to yourself" });
        }

        // Check if receiver ID is provided
        if (!receiverID) {
            return res.status(400).json({ message: "Receiver ID is required" });
        }

        // Check if sender user exists
        const senderUser = await User.findById(senderUserID);
        if (!senderUser) {
            return res.status(400).json({ message: "Sender user does not exist" });
        }

        // Check if receiver user exists
        const receiverUser = await User.findById(receiverID);
        if (!receiverUser) {
            return res.status(400).json({ message: "Receiver user does not exist" });
        }

        // Check if coins value is valid
        if (!coins || typeof coins !== "number") {
            return res.status(400).json({ message: "Coins should be a valid number" });
        }

        // Check if sender has enough coins
        if (senderUser.coins < coins) {
            return res.status(400).json({ message: "User does not have enough coins" });
        } else if (senderUser.coins < 50) {
            // Limit is 50 to transfer the coins
            return res.status(400).json({ message: "Your coins should be greater than 50" });
        } else {
            // Transfer coins
            senderUser.coins -= coins;
            receiverUser.coins += coins;
            await senderUser.save();
            await receiverUser.save();

            // Save data in transfercoins model
            const newtransferCoin = new TransferCoin({
                sender: {
                    id: senderUser._id,
                    username: senderUser.username,
                },
                receiver: {
                    id: receiverUser._id,
                    username: receiverUser.username,
                },
                coins: coins,
            });
            await newtransferCoin.save();

            return res.status(200).json({
                message: "Coins transferred successfully",
                senderUser: senderUser,
                receiverUser: receiverUser,
                transferCoin: newtransferCoin
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "An error occurred during the coins transfer." });
    }
});


//get transfer coins history
const getTransferCoinsHistory = asyncHandler(async (req, res) => {
    try {
        const transferCoinsHistory = await TransferCoin.find({}).sort({ createdAt: -1 });
        res.status(200).json({ transferCoinsHistory: transferCoinsHistory });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An error occurred during the coins transfer." });
    }
});

//get transfer coins history by user
const getTransferCoinsHistoryByUser = asyncHandler(async (req, res) => {
    const { userID } = req.params;
    try {
        const user = await User.findById(userID);
        if (!user) {
            return res.status(400).json({ message: "User does not exist" })
        }

        const transferCoinsHistory = await TransferCoin.find({ $or: [{ "sender.id": userID }, { "receiver.id": userID }] })
            .sort({ createdAt: -1 })
            .limit(5);

        res.status(200).json({ transferCoinsHistory: transferCoinsHistory });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An error occurred during the coins transfer." });

    }
});
const lottery = asyncHandler(async (req, res) => {
    try {
        const randomNumber = Math.floor(Math.random() * 30);
        const coinsWon = randomNumber;

        const userID = req.user.id;

        const user = await User.findById(userID);
        if (user) {
            const lastPlayedLottery = new Date(user.lastPlayedLottery).getTime();
            const twentyFourHoursAgo = Date.now() - 24 * 60 * 60 * 1000;
            const hoursUntilNextLottery = -(Math.ceil((twentyFourHoursAgo - lastPlayedLottery) / 3600000));

            if (lastPlayedLottery > twentyFourHoursAgo) {
                return res.status(400).json({ message: `You have already played the lottery in the last 24 hours. You can play it again in ${hoursUntilNextLottery} hours.` });
            }

            user.coins += coinsWon;
            user.lastPlayedLottery = Date.now();
            await user.save();

            if (coinsWon === 0) {
                res.status(200).json({ message: `You won ${coinsWon} coins, sorry this was a fantasy from @karangandh`, user: user });
            } else {
                res.status(200).json({ message: `You won ${coinsWon} coins in the lottery!`, user: user });
            }
        } else {
            return res.status(400).json({ message: 'User not found' });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'An error occurred during the lottery.' });
    }
});

module.exports = {
    transferCoins,
    getTransferCoinsHistory,
    getTransferCoinsHistoryByUser,
    lottery
};
