const Community = require('../models/communityModel');
const bcrypt = require('bcryptjs');
const AWS = require('aws-sdk')
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');






AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'us-east-2'
})

const s3 = new AWS.S3();




const createCommunity = async (req, res) => {
    try {
        const { name, description, password } = req.body;
        if (!name || !description) {
            return res.status(400).json({ error: "Please enter all the fields" });
        }

        
        const existing_community = await Community.findOne({ name });

        let hashedPassword = password;  // Use let instead of const

        if (password) {
            const salt = await bcrypt.genSalt(10);
            hashedPassword = await bcrypt.hash(password, salt);
        }

        if (existing_community) {
            return res.status(400).json({ error: "This community already exists" });
        }

        const community = await Community.create({
            name,
            description,
            creator: req.user.id,
            password: hashedPassword ? hashedPassword : null,
        });
        community.members.push(req.user.id);
        await community.save();

        if(req.file){
            const fileKey = `${uuidv4()}-${req.file.originalname}`;
            const params = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: fileKey,
                Body: fs.createReadStream(req.file.path),
                ContentType: req.file.mimetype
            };
            const data = await s3.upload(params).promise();
            community.image = data.Location;
            await community.save();
        }

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
        const { password } = req.body;
       
        const community = await Community.findById(id);
        if (!community) {
            return res.status(400).json({ error: "No such community exists" });
        }
        if(password){
            const isMatch = await bcrypt.compare(password, community.password);
            if (!isMatch) {
                return res.status(400).json({ message: "Invalid password" });
            }
            community.members.push(req.user.id);
            await community.save();
            return res.status(200).json({ community,message: `You have successfully joined ${community.name} community` });
        }else{
            community.members.push(req.user.id);
            await community.save();
            res.status(200).json({ community,message: `You have successfully joined ${community.name} community` });
        }
       
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getCommunityInWhichUserIsMember = async (req, res) => {
    try {
        const communities = await Community.find({ members: req.user.id }).populate('creator', 'name email username')
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