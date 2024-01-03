const asyncHandler = require('express-async-handler');
const { ModuleName } = require('../models/moduleModel');
const { Subject } = require('../models/subjectModel');

const getAllModules = asyncHandler(async (req, res) => {
    const mods = await ModuleName.find().populate('subject');
    res.status(200).json(mods);
});

const addModules = asyncHandler(async (req, res) => {
    const { name, subject } = req.body;
    if (!name || !subject) {
        res.status(403);
        throw new Error("All fields are mandatory");
    }
    const subModel = await Subject.findById(subject);
    if (!subModel) {
        res.status(404);
        throw new Error("Such subject does not exists in the database");
    }
    const newMod = await ModuleName.create({
        name,
        subject
    });
    await subModel.module.push(newMod);
    subModel.save();

    res.status(201).json(newMod);

});

module.exports = { getAllModules, addModules };