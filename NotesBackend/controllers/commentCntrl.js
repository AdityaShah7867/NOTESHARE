const { Comment } = require('../models/commentModel');
const { Note } = require('../models/noteModel');
const { User } = require('../models/userModel');


const natural = require('natural');
const tokenizer = new natural.WordTokenizer();
const SentimentAnalyzer = require('natural').SentimentAnalyzer;
const stemmer = require('natural').PorterStemmer;
const analyzer = new SentimentAnalyzer('English', stemmer, 'afinn');



const createComment = async (req, res) => {
    const { noteId } = req.params;
    const { comment } = req.body;
    try {
        if (!comment) {
            res.status(401).json({ message: "comment is required" })
        }
        const user = req.user.id;
        const ExistingUSer = await User.findById(user);
        const note = await Note.findById(noteId);
        if (!note) {
            res.status(401).json({ message: "note not found" })
        }
        if (!ExistingUSer) {
            res.status(401).json({ message: "user not found" })
        }
        const newCommnet = await Comment.create({
            noteId: noteId,
            comment: comment,
            user: user
        })


        note.comments.push(newCommnet._id);
        await note.save();
        newCommnet.save();
        res.status(200).json({ message: "comment added succesfully", comment: newCommnet })
    } catch (error) {
        console.log(error)
        res.status(401).json(error)
    }
}


const getCommentsByNoteId = async (req, res) => {
    const { noteId } = req.params;
    try {
        const note = await Note.findById(noteId);
        if (!note) {
            res.status(401).json({ message: "post not found" })
        }

        const comments = await Comment.find({ noteId: noteId }).populate('user').sort({ createdAt: -1 })

        const updatedComments = await Promise.all(comments.map(async (comment) => {
            const tokens = tokenizer.tokenize(comment.comment);
            const sentiment = analyzer.getSentiment(tokens);
            return {
                _id: comment._id,
                noteId: comment.noteId,
                comment: comment.comment,
                user: comment.user,
                createdAt: comment.createdAt,
                updatedAt: comment.updatedAt,
                sentiment: sentiment
            };
        }));
        const qty = comments.length

        res.status(200).json({ message: "comments succesfully fetched", comments: updatedComments, qty: qty })
    } catch (error) {
        res.status(401).json(error)
    }
}



module.exports = {
    getCommentsByNoteId, createComment
}