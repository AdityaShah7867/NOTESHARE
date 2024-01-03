const asyncHandler = require('express-async-handler');
const { Branch } = require('../models/branchModel')

const getAllBrnch = asyncHandler(async (req, res) => {
    const branch = await Branch.find();
    res.status(200).json(branch);
});



const addBranch = asyncHandler(async (req, res) => {
    const { name, year } = req.body;

    if (!name || !year) {
        res.status(403);
        throw new Error("All fields are mandatory");
    }

    const branch = await Branch.create({
        name,
        year
    });

    res.status(201).json(branch);

});



module.exports = { getAllBrnch, addBranch }
