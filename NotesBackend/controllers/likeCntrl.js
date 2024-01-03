const { Like } = require('../models/likeModel');
const { Note } = require('../models/noteModel');

const likeUnlikeNote = async (req, res) => {
    const { noteId } = req.params;
    const user = req.user.id;
    try {
        const like = await Like.findOne({ noteId: noteId, user: user });
        const note = await Note.findById(noteId);
        if (!note) {
            res.status(401).json({ message: "note not found" })
        }
        if (!like) {
            const newLike = await Like.create({
                noteId: noteId,
                user: user
            })

            note.likes.push(newLike._id);
            await note.save();
            res.status(200).json({ message: "liked", like: newLike })
        } else {
            await Like.findByIdAndDelete(like._id);
            note.likes.pull(like._id)
            await note.save();
            res.status(200).json({ message: "unliked" })

        }
    } catch (error) {
        res.status(401).json(error)
    }
}


module.exports = {
    likeUnlikeNote
}