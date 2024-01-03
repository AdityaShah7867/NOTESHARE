const { ImpDate } = require('../models/impDatesModel')
const { User } = require('../models/userModel')


const creatImpDate = async (req, res) => {
    try {
        const user = req.user.id;
        const ExistingUser = await User.findById(user);
        if (ExistingUser.role === "superuser") {
            const { title, date, description } = req.body;
            if (!title || !date || !description) {
                return res.status(400).json({ message: "Please enter all fields" })
            }
            const impDate = await ImpDate.create({ title, date, description });
            res.status(201).json({ impDate: impDate, message: "Imp Date created" });
        } else {
            res.status(401).json({ message: "You are not authorized to create an important date" });
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Something went wrong" });
    }
}


const getImpDates = async (req, res) => {
    try {
        const impDates = await ImpDate.find();
        res.status(200).json({ impDates: impDates, message: "Imp Dates fetched" });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
}


module.exports = {
    creatImpDate,
    getImpDates
}