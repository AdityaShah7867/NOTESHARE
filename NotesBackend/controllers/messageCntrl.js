const Message = require('../models/messagesModel');
const Community = require('../models/communityModel');

const createMessage = async (req, res) => { 

    try {
        const { content, community } = req.body;
        if (!content || !community) {
            return res.status(400).json({ error: "Please enter all the fields" });
        }
        const community1 = await Community.findById(community);
        if (!community1) {
            return res.status(400).json({ error: "No such community exists" });
        }
        const message_ = await Message.create({ content, community, sender: req.user.id });
        community1.messages.push(message_._id);
        community1.latestMessage = message_._id;
        await community1.save();
        res.status(200).json({ message_, message: "Message sent successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getCommunityMessages = async (req, res) => {

    try {
        const { id } = req.params;
        const community = await Community.findById(id).populate('messages');
        if (!community) {
            return res.status(400).json({ error: "No such community exists" });
        }
        for(const message of community.messages){
            await message.populate('sender', 'username')
        }
        
        res.status(200).json({ messages: community.messages });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = { createMessage, getCommunityMessages };