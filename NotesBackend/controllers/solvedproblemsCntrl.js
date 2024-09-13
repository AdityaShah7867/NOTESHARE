const Solvedproblems = require('../models/solvedproblemModel');
const { User } = require('../models/userModel');

const createSolvedproblems = async (req, res) => {
    const { questionId } = req.body;
    try {
        if (!questionId) {
            res.status(401).json({ message: "solvedproblems is required" })
        }
        const user = req.user.id;
        console.log("requesting")

        const ExistingUSer = await User.findById(user);
        if (!ExistingUSer) {
            res.status(401).json({ message: "user not found" })
        }
        const newSolvedproblems = new Solvedproblems({
            solvedproblems: questionId,
            user: user
        })
        newSolvedproblems.save();
        res.status(200).json({ message: "solvedproblems added succesfully", solvedproblems: newSolvedproblems })
    } catch (error) {
        console.log(error)
        res.status(401).json(error)
    }
}

const getsolvedproblemsByUserId = async (req, res) => {
    try {
        // console.log("requesting")
        const user = await User.findById(req.user.id)
        if (!user) {
            return res.status(400).json({ error: "User does not exist" });
        }
        const solvedproblems = await Solvedproblems.find({ user: user }).populate('user').sort({ createdAt: -1 })
        const filteredproblems = solvedproblems.map((problem) => problem.solvedproblems)
        if (!solvedproblems) {
            return res.status(200).json({ message: "No solvedproblems found" });
        }
        const qty = solvedproblems.length

        res.status(200).json({ message: "solvedproblems succesfully fetched", solvedproblems: filteredproblems, qty: qty })
    }
    catch (error) {
        res.status(400).json(error)
    }
}

module.exports = { createSolvedproblems, getsolvedproblemsByUserId }