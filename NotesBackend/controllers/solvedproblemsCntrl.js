const Solvedproblems = require('../models/solvedproblemModel');
const { User } = require('../models/userModel');

const createSolvedproblems = async (req, res) => {
    const { questionId, problem, date } = req.body; // Include problem and date
    try {
        if (!questionId || !problem || !date) { // Check for all required fields
            return res.status(401).json({ message: "questionId, problem, and date are required" });
        }
        const user = req.user.id;
        console.log("requesting")

        const ExistingUSer = await User.findById(user);
        if (!ExistingUSer) {
            res.status(401).json({ message: "user not found" })
        }
        const newSolvedproblems = new Solvedproblems({
            user: user,
            problem: problem, // Add problem
            date: date, // Add date
            questionId: questionId
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
        

        if (!solvedproblems) {
            return res.status(200).json({ message: "No solvedproblems found" });
        }
        const qty = solvedproblems.length

        res.status(200).json({ message: "solvedproblems succesfully fetched", solvedproblems: solvedproblems, qty: qty })
    }
    catch (error) {
        res.status(400).json(error)
    }
}

module.exports = { createSolvedproblems, getsolvedproblemsByUserId }
