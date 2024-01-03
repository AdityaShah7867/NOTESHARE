const Community = require('../models/communityModel');

const createCommunity = async (req, res) => {
    try {
        const { name, description } = req.body;
        if (!name || !description) {
            return res.status(400).json({ error: "Please enter all the fields" });
        }
        const existing_community = await Community.findOne({ name });

        if (existing_community) {
            return res.status(400).json({ error: "This community already exists" });
        }

        const community = await Community.create({ name, description, creator: req.user.id });
        community.members.push(req.user.id);
        await community.save();

        res.status(200).json({ community });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getAllCommunities = async (req, res) => {
    try {
        const communities = await Community.find({}).populate('creator', 'name email username')
        res.status(200).json({ communities });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getCommunity = async (req, res) => {
    try {
        const { id } = req.params;
        const community = await Community.findById(id).populate('creator', 'name email').populate('messages', 'content sender createdAt').populate('members', 'name email');
        if (!community) {
            return res.status(400).json({ error: "No such community exists" });
        }
        res.status(200).json({ community });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const updateCommunity = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;
        if (!name || !description) {
            return res.status(400).json({ error: "Please enter all the fields" });
        }
        const community = await Community.findByIdAndUpdate(id, { name, description }, { new: true });
        res.status(200).json({ community });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const deleteCommunity = async (req, res) => {
    try {
        const { id } = req.params;
        const community = await Community.findByIdAndDelete(id);
        res.status(200).json({ community });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const joinCommunity = async (req, res) => {

    try {
        const { id } = req.params;
        const community = await Community.findById(id);
        if (!community) {
            return res.status(400).json({ error: "No such community exists" });
        }
        community.members.push(req.user.id);
        await community.save();
        res.status(200).json({ community,message: `You have successfully joined ${community.name} community` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getCommunityInWhichUserIsMember = async (req, res) => {
    try {
        const communities = await Community.find({ members: req.user.id }).populate('creator', 'name email')
        res.status(200).json({ communities });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


const leaveCommunity = async (req,res) => {
    try{
        const {id} = req.params;
        const community = await Community.findById(id);
        if(!community){
            return res.status(400).json({error:"No such community exists"});
        }
        community.members.pull(req.user.id);
        await community.save();
        res.status(200).json({community,message:`You have successfully left ${community.name} community`});
    }catch(error){
        res.status(500).json({error:error.message});
    
    }
}
module.exports = {

    createCommunity,
    getAllCommunities,
    getCommunity,
    updateCommunity,
    deleteCommunity,
    joinCommunity,
    getCommunityInWhichUserIsMember, 
    leaveCommunity
}