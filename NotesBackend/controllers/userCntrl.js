const asyncHandler = require('express-async-handler');
const { User } = require('../models/userModel')
const { OTP } = require('../models/otpModel')
const { Note } = require('../models/noteModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const { sendVerificationEmail, generateverificationToken, generateOTP } = require('../utils/email')
const { resetPasswordEmail } = require('../utils/resetpasswordemail')
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const isEmailEdu = require('../utils/isEduEmail')
const { successFullVerification } = require('../utils/EmailTemplates')
const AWS = require('aws-sdk')
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();
const fs = require('fs');


const userInfo = asyncHandler(async (req, res) => {
    const user = req.user.id;

    const existingUser = await User.findById(user).select('-notesUploaded -notesBought -password ')
    if (!existingUser) {
        res.status(401).json({ message: "user not found" })
    }
    res.status(200).json({ message: 'Authentication successful', user: existingUser });
});





// aws confioguration
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'us-east-2'
})

const s3 = new AWS.S3();


const initialCall = async (req, res) => {
    try {
        res.status(200).json({ message: "server started" })
    } catch (error) {
        console.log(error)
    }
}


const registerUser = asyncHandler(async (req, res) => {
    try {
        const { username, email, password, Department, role } = req.body;

        if (!username || !email || !password || !Department) {
            res.status(400).json({ message: "all fields are required" });
            return;
        }

        if (!isEmailEdu(email)) {
            res.status(404).json({ message: "Only vcet id is accepted" })
        }

        // Convert the email to lowercase for case-insensitive comparison
        const lowercaseEmail = email.toLowerCase();

        const userAvailable = await User.findOne({ email: lowercaseEmail, username: username });

        if (userAvailable) {
            res.status(400).json({ message: "user already exists" });
            return;
        }

        const verificationToken = generateverificationToken(lowercaseEmail);
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            username,
            email: lowercaseEmail,
            role,
            Department,
            password: hashedPassword,
            verificationToken,
        });

        await sendVerificationEmail(lowercaseEmail, verificationToken);

        res.json({
            message: 'Registration successful. Please check your email for verification.',
            verificationToken,
            user,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error);
    }
});

const verifyemail = async (req, res) => {
    try {
        const tokenId = req.params.tokenId;
        const user = await User.findOne({ verificationToken: tokenId });

        if (!user) {
            return res.status(404).json({ error: 'Invalid verification token.' });
        }

        user.isVerified = true;
        user.verificationToken = null;
        await user.save();

        const congratulationContent = successFullVerification();

        res.send(congratulationContent);

    } catch (error) {
        res.status(500).json({ error: 'An error occurred during email verification.' });
        console.log(error);
    }
};

//login user
const loginUser = asyncHandler(async (req, res) => {

    try {

        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ message: "all fileds are required" })
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            res.status(404).json({ message: `user with ${email} does not exist` })
        }
        const verificationToken = generateverificationToken(email);
        if (!user.isVerified) {
            res.status(403);
            user.verificationToken = verificationToken;
            await user.save();
            sendVerificationEmail(email, verificationToken);
            res.status(400).json({ message: "A new email has been sent to your email plz verify!!" })
        }


        if (user && await bcrypt.compare(password, user.password)) {
            const accessToken = jwt.sign({
                id: user._id,
                email: user.email,
                role: user.role,
                isVerified: user.isVerified
            }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
            res.status(200).json({ token: accessToken, message: "User logged in", user: user });
        } else {
            res.status(401).json({ message: "Invalid credentials" })
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error);
    }
});


//send-reset-password-email
const sendResetPasswordEmail = async (req, res) => {


    try {
        const { email } = req.body;
        console.log(email)
        let user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'Email does not exist' });
        } else {
            //logic to delete exisitng otp
            const otpexist = OTP.findOne({ email: req.body.email })
            if (otpexist) {
                await OTP.deleteMany({ email: req.body.email });
            }

            const expirationDate = new Date(Date.now() + 10 * 60 * 1000);
            const otpcode = generateOTP();
            const otpData = new OTP({
                code: otpcode,
                email: req.body.email,
                expiration: expirationDate,
            });

            await otpData.save();
            await resetPasswordEmail(req.body.email, otpcode);

            res.status(200).json({ message: 'OTP sent successfully' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error' });
        console.log(error);
    }
};


const resetPassword = async (req, res) => {
    const { email, otpCode, password } = req.body;
    try {

        let data = await OTP.findOne({ email, code: otpCode });



        if (!data) {
            return res.status(404).json({ message: 'Invalid OTP' });
        } else {
            let currentTime = new Date();
            if (currentTime > data.expiration) {
                res.status(401).json({ message: "Token Expired" });
            } else {
                let user = await User.findOne({ email });


                if (!user) {
                    res.status(404).json({ message: "User does not exist" });
                } else {
                    const hashedPassword = await bcrypt.hash(password, 10);
                    user.password = hashedPassword;
                    await user.save();
                    res.status(200).json({ message: "Password changed successfully" });
                }
            }
        }
    } catch (error) {
        res.status(500).json({ message: 'Error' });
        console.log(error);
    }
}


const getUserById = async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User found", user: user });

    } catch (error) {
        res.status(501).json({ message: error })
    }
}

//gettotalLikes by userId

const getTotalLikes = async (userId) => {
    const notes = await Note.find({ author: userId });
    let totalLikes = 0;

    notes.forEach(note => {
        totalLikes += note.likes.length;
    })
    return totalLikes;
}


const getUserRank = async (userId) => {
    const users = await User.find({ isVerified: true }).sort({ coins: -1 });
    let rank = 0;
    users.forEach((user, index) => {
        if (user.id === userId) {
            rank = index + 1;
        }
    })
    return rank;

}

const getUserInfo = async (req, res) => {

    try {

        const userId = req.user.id;
        const existingUser = await User.findById(userId);
        if (!existingUser) {
            res.status(401).json({ message: "user not found" })
        }

        const userRank = await getUserRank(userId);



        const totalLikesOfUser = await getTotalLikes(userId);

        const userDetails = {
            rank: userRank,
            coins: existingUser.coins,
            notesUploaded: existingUser.notesUploaded?.length || 0,
            notesBought: existingUser.notesBought?.length || 0,
            notesBought: existingUser.notesBought?.length || 0,
            totalLikes: totalLikesOfUser || 0

        }

        res.status(200).json({ userDetails: userDetails })

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error })
    }
}

const getUsersLeaderBoard = async (req, res) => {
    try {
        const users = await User.find({ isVerified: true }).sort({ coins: -1 });
        if (!users) {
            return res.status(401).json({ message: "No users found" });
        }

        const usersLeaderBoard = users.map((user, index) => {
            return {
                rank: index + 1,
                username: user.username,
                coins: user.coins,
                id: user.id
            };
        });

        res.json(usersLeaderBoard);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
const editProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { username, githubUsername, Bio, Department } = req.body;
        // if (!username) {
        //     return res.status(400).json({ message: "Username is required" })
        // }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Upload the image to AWS if a file is provided
        if (req.file) {
            console.log("File present")
            
            const fileKey = `${uuidv4()}-${req.file.originalname}`;
            const params = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: fileKey,
                Body: fs.createReadStream(req.file.path),
                ContentType: req.file.mimetype
            };
            const data = await s3.upload(params).promise();
            user.profile = data.Location;
            console.log("File uploaded successfully")
        }else{
            console.log("No file provided")
        }

        user.username = username?username:user.username;
        user.githubUsername = githubUsername?githubUsername:user.githubUsername;
        user.Bio = Bio?Bio:user.Bio;
        user.Department = Department?Department:user.Department;

        await user.save();

        res.status(200).json({ message: "Profile updated successfully", profile: user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};



const getUserProfile = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await User.findOne({ username: username })
            .select('-password -verificationToken ')
            .exec();

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User found", user: user });
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
};


const searchUser = async (req, res) => {
    try {
        const { username } = req.query;

        const user = await User.find({ username: { $regex: username, $options: 'i' } })
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        res.status(200).json({ message: "User found", user: user })
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
}




module.exports = {
    userInfo,
    registerUser,
    loginUser,
    verifyemail,
    sendResetPasswordEmail,
    resetPassword,
    getUserInfo,
    getUserById,
    getUsersLeaderBoard,
    editProfile,
    getUserProfile,
    searchUser,
    initialCall

} 