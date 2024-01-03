const asyncHandler = require('express-async-handler');
const { Note } = require('../models/noteModel');
const { User } = require('../models/userModel');
const { Branch } = require('../models/branchModel')
const { Subject } = require('../models/subjectModel')
const { ModuleName } = require('../models/moduleModel')

const fs = require('fs');
const path = require('path')
const AWS = require('aws-sdk')
require('dotenv').config();

// aws confioguration
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'us-east-2'
})

const s3 = new AWS.S3();

const buyNote = async (req, res) => {
    const { noteId } = req.params;
    const user = req.user.id;
    try {
        const ExistingUser = await User.findById(user)
        if (!ExistingUser) {
            res.status(404).json({ message: "User not found" })
        }
        const note = await Note.findById(noteId);
        if (!note) {
            res.status(404).json({ message: `No note found with id ${noteId}` });
            return;
        }
        if (note.purchased.includes(user)) {
            res.status(404).json({ message: `You have already bought this note` });
            return;
        }

        if (ExistingUser.coins < 10) {
            res.status(404).json({ message: `You don't have enough coins` });
            return;
        }
        ExistingUser.coins -= 10;
        ExistingUser.notesBought.push(noteId);
        note.purchased.push(user);
        await note.save();
        await ExistingUser.save();
        res.status(200).json({ message: "Note bought successfully", note: note, user: ExistingUser });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}




const getAllNotes = asyncHandler(async (req, res) => {
    try {

        const notes = await Note.find({ acceptedStatus: true }).populate('author', '-notesUploaded -notesBought').populate('subject')



        res.status(200).json({ message: "Notes fetched successfully", data: notes });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


const getNotesById = async (req, res) => {
    try {
        const { noteID } = req.params;
        const note = await Note.findById(noteID);
        if (!note) {
            res.status(401).json({ mssg: "note not found" })
        }
        res.status(200).json({ mssg: "note found", note: note })
    } catch (error) {
        res.status(501).json({ mssg: error })
    }
}

const addNotes = asyncHandler(async (req, res) => {
    try {
        const { name, subject, module, desc } = req.body;

        //add validation
        if (!name || !subject || !module || !desc) {
            return res.status(400).json({ message: "Please enter all the fields" })
        }


        if (req.body === null) {
            res.status(400).json({ message: "Please upload a file" });
            return;
        }

        const newNote = await Note.create({
            name,
            subject,
            module,
            desc,
            author: req.user.id,
            file: req.file.path,
            fileMimeType: req.file.mimetype,
        });

        const user = await User.findById(req.user.id);
        user.notesUploaded.push(newNote);
        user.notesBought.push(newNote);
        newNote.purchased.push(req.user.id);
        await newNote.save()

        await user.save();

        res.status(201).json({
            message: "Note uploaded successfully",
            data: newNote,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});



const AcceptRejectNotes = async (req, res) => {
    const { NoteId } = req.params;
    try {
        const user = req.user.id;

        const ExistingUser = await User.findById(user)
        if (!ExistingUser) {
            res.status(404).json({ message: "User not found" })
        }

        if (ExistingUser.role !== "superuser") {
            return res.status(403).json({ message: "You are not authorized to access this route" });
        }
        const note = await Note.findById(NoteId);
        if (!note) {
            return res.status(404).json({ message: `No note found with id ${NoteId}` });
        }

        const Author = await User.findById(note.author);

        if (note.acceptedStatus === false) {
            note.acceptedStatus = true;
            Author.coins += 50;
            try {

                if (!note.uploadedToS3) {
                    const fileKey = `${note.name}-${note.file}`;
                    const filePath = note.file;

                    const params = {
                        Bucket: process.env.AWS_BUCKET_NAME,
                        Key: fileKey,
                        Body: fs.createReadStream(filePath),
                        ContentType: note.fileMimeType,
                    }


                    const s3Response = await s3.upload(params).promise();

                    note.file = s3Response.Location;
                    fs.unlinkSync(filePath);
                    note.uploadedToS3 = true;
                }

                await note.save();
                await Author.save();
                return res.status(200).json({ message: "Note accepted successfully", note: note });
            } catch (s3Error) {
                console.error("Error uploading file to S3:", s3Error);
                return res.status(500).json({ message: "Error uploading file to S3" });
            }
        } else {
            note.acceptedStatus = false;
            Author.coins -= 50;
            await Author.save()
            await note.save();
            return res.status(200).json({ message: "Note rejected successfully", note: note });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}



const deleteNote = asyncHandler(async (req, res) => {
    try {
        const { noteId } = req.params;
        const user = req.user.id;

        const ExistingUser = await User.findById(user)
        if (!ExistingUser) {
            res.status(404).json({ message: "User not found" })
        }

        if (ExistingUser.role !== "superuser") {
            res.status(403).json({ message: "You are not authorized to access this route" });
            return;
        }
        const note = await Note.findById(noteId).populate("author");
        if (!note) {
            res.status(404).json({ message: `Unable to find note with id ${noteId}` });
            return;
        }
        note.author?.notesUploaded.pull(noteId);
        await note.author.save();

        fs.unlink(path.join(__dirname, '..', note.file), (err) => {
            if (err) {
                console.error(err);
            }
        });

        await Note.findOneAndDelete({ _id: noteId });

        res.status(200).json({ message: "Note successfully deleted" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

const getSingleNote = asyncHandler(async (req, res) => {
    try {
        const { noteId } = req.params;
        const note = await Note.findById(noteId).populate("author");
        if (!note) {
            res.status(404).json({ message: `Unable to find note with id ${noteId}` });
            return;
        }
        res.status(200).json({ message: "Note fetched successfully", data: note });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});



const fetchUserById = async (authorID) => {
    try {
        const user = await User.findById(authorID).select('_id username email coins role');
        return user;
    } catch (error) {
        console.error(error);
        return null;
    }
}


const getNotesAdmin = async (req, res) => {
    try {
        const user = req.user;

        if (user.role === "superuser") {
            const notes = await Note.find().populate('author', '-notesUploaded -notesBought').populate('subject')

            res.status(200).json({ message: "Notes fetched successfully", data: notes });
        } else {
            console.log("Not authorized to access this route");
            res.status(403).json({ message: "You are not authorized to access this route" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};



const getFormData = async (req, res) => {
    try {
        const getModules = await ModuleName.find();
        const getSubjects = await Subject.find();
        const getBranches = await Branch.find();

        res.status(200).json({ message: "Data fetched successfully", data: { module: getModules, branches: getBranches, subject: getSubjects } });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }

}


const searchNote = async (req, res) => {
    try {
        const { search } = req.query;
        const notes = await Note.find({ acceptedStatus: true }).populate('subject author')
        if (!search) {
            return res.status(200).json({ message: "Please enter something to search", searchData: notes })
        }

        const filterdData = notes.filter((note) => {

            return (
                note.name.toLowerCase().includes(search.toLowerCase()) ||
                note.desc.toLowerCase().includes(search.toLowerCase()) ||
                note.subject.name.toLowerCase().includes(search.toLowerCase())
            );


        })

        res.status(200).json({ message: "Notes fetched successfully", searchData: filterdData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}


const filterPost = async (req, res) => {
    try {
        const { branch, module, subject } = req.query;
        console.log(branch, module, subject)
        const notes = await Note.find().populate('subject')

        const filterdData = notes.filter((note) => {
            return (
                note.subject.name.toLowerCase().includes(subject.toLowerCase()) ||
                note.subject.module.toLowerCase().includes(module.toLowerCase()) ||
                note.subject.branch.toLowerCase().includes(branch.toLowerCase())

            )

        })

        res.status(200).json({ message: "Notes fetched successfully", searchData: filterdData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });

    }
}

// http://localhost:4000/api/v1/notes/search?search=EEB -> this is how the route will look like

const bookMarkNotes = async (req, res) => {
    try {
        const { noteId } = req.params;
        const note = await Note.findById(noteId);
        if (!note) {
            res.status(404).json({ message: `No note found with id ${noteId}` });
            return;
        }
        const user = req.user.id;
        const ExistingUser = await User.findById(user).select('notesBookMarked')
        if (!ExistingUser) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        if (ExistingUser.notesBookMarked.includes(noteId)) {
            ExistingUser.notesBookMarked.pull(noteId);
            await ExistingUser.save();
            res.status(200).json({ message: "Note removed from bookmarked notes", user: ExistingUser });
            return;
        } else {
            ExistingUser.notesBookMarked.push(noteId);
            await ExistingUser.save();
            res.status(200).json({ message: "Note added to bookmarked notes", user: ExistingUser });
            return;
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const getBookMarkedNotes = async (req, res) => {
    try {
        const user = req.user.id;
        const existingUser = await User.findById(user).populate({
            path: 'notesBookMarked',
            populate: {
                path: 'subject',
            },
        });

        if (!existingUser) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.status(200).json({
            message: 'Bookmarked notes fetched successfully',
            notes: existingUser.notesBookMarked,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const getFilterdFormData = async (req, res) => {
    try {
        const { branch, module, subject } = req.query;
        // const getModules = await ModuleName.find().select('name')
        const getSubjects = await Subject.find().populate('branch', 'name').select('name branch')
        const getBranches = await Branch.find().select('name')
        res.status(200).json({ message: "Data fetched successfully", data: { branches: getBranches, subject: getSubjects } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }

}

const filterNote = async (req, res) => {
    try {
        const { branch, subject, module, type } = req.query;
        const notes = await Note.find().populate({ path: 'subject', populate: { path: 'branch', select: 'name' } });
        if (branch && subject) {
            const filterdData = notes.filter((note) => {
                return (
                    note?.subject?.name?.toLowerCase()?.includes(subject?.toLowerCase() ?? '')
                )
            })
            res.status(200).json({ message: "Notes fetched successfully", searchData: filterdData, qty: filterdData.length });
            return;
        } else {
            const filterdData = notes.filter((note) => {
                return (
                    note?.subject?.name?.toLowerCase()?.includes(subject?.toLowerCase() ?? '') ||
                    note?.subject?.branch?.name?.toLowerCase()?.includes(branch?.toLowerCase() ?? '') ||
                    note?.type?.toLowerCase()?.includes(type?.toLowerCase() ?? '')
                )
            })
            res.status(200).json({ message: "Notes fetched successfully", searchData: filterdData, qty: filterdData.length });
            return;
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });

    }
}
module.exports = { filterNote, getBookMarkedNotes, filterPost, getAllNotes, addNotes, deleteNote, getSingleNote, getNotesAdmin, AcceptRejectNotes, getFormData, buyNote, searchNote, bookMarkNotes, getFilterdFormData };

