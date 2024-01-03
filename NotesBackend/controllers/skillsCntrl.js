const { User } = require('../models/userModel')

const createSkills = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(400).json({ error: "User does not exist" });
        }

        const skills = req.body.skills;

        const formatedArray = skills.split(',')

        formatedArray.forEach((skill) => {
            user.skills.push(skill)
        })

        await user.save();
        console.log(formatedArray);

        return res.status(200).json({
            message: "Skills added successfully",
            skills: user.skills
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}


const getSkills = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(400).json({ error: "User does not exist" });
        }

        const skills = user.skills;

        return res.status(200).json({ skills: skills });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}


const removeSkills = async (req, res) => {
    const { skills } = req.body;
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(400).json({ error: "User does not exist" });
        }
        const usersSkills = user.skills;

        const SkillsToRemove = skills.split(',');
        const formattedSKills = usersSkills.filter((skill) => {
            return !SkillsToRemove.includes(skill);
        })

        user.skills = formattedSKills;
        await user.save();
        return res.status(200).json({ message: "Skills removed successfully" });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

module.exports = {
    createSkills,
    getSkills,
    removeSkills
}