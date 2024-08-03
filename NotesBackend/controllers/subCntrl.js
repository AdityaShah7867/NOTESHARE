const asyncHandler = require('express-async-handler');
const { Subject } = require('../models/subjectModel');
const { Branch } = require('../models/branchModel')

const getAllSubjects = asyncHandler(async (req, res) => {

    const subs = await Subject.find().populate('branch');
    res.status(200).json(subs);
});

const addSubjects = asyncHandler(async (req, res) => {
    try {
        const { name, branch, sem, teacher, Image } = req.body;
        console.log(name, branch, sem)
        if (!name) {
            res.status(400);
            throw new Error("Name fields are mandatory");
        }
        if (!sem) {
            res.status(400);
            throw new Error("Sem fields are mandatory");
        }
        if (!branch) {
            res.status(400);
            throw new Error("Branch fields are mandatory");
        }

        const existingSub = await Subject.findOne({ name: name });
        if (existingSub) {
            res.status(409);
            throw new Error("Subject already exists");
        }

        const branchModel = await Branch.findOne({ name: branch });
        if (!branchModel) {
            res.status(404);
            throw new Error("Such branch does not exist");
        }
        const newSub = await Subject.create({
            name,
            branch: branchModel,
            sem,
            // Image
        });

        branchModel.subjects.push(newSub);
        await branchModel.save();

        res.status(201).json({
            message: "Subject created successfully",
            data: newSub
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error);
    }
});

module.exports = { getAllSubjects, addSubjects }
