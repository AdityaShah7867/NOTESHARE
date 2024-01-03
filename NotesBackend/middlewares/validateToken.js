const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');

const validateToken = asyncHandler(async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            return res.status(401).json({ msg: "No token, authorization denied" });
        }

        try {
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

            if (decoded.exp < Date.now() / 1000) {
                return res.status(401).json({ msg: "Token has expired" });
            }
            req.user = decoded;

            next();
        } catch (error) {
            res.status(401).json({ msg: "Token is not valid", error: error.message });
            console.log("Error verifying token:", error);
        }
    } catch (error) {
        res.status(500).json({ msg: "Internal server error" });
        console.log("Unexpected error:", error);
    }
});

module.exports = validateToken;
