const { verify } = require('jsonwebtoken');
const { User } = require("../models")
require('dotenv').config();
const validateDriver = async (req, res, next) => {
    try {
        const accessToken = req.header("Authorization").split(" ")[1];
        if (!accessToken) {
            return res.status(401).json({message: "JWT token is required"});
        }
        const payload = verify(accessToken, process.env.APP_SECRET);

        if (payload.type != "session") {
            return res.status(401).json({message: "JWT token is not the correct type"});
        }
        // Get user from database
        const user = await User.findByPk(payload.user.email)
        if (!user) {
            return res.sendStatus(401);
        }
        // Check if user is admin
        if (user.account_type != 2) {
            return res.status(403).json({message: "You have no permission to access this resource"});
        }
        req.user = payload.user;
        return next();
    }
    catch (err) {
        console.log(err)
        return res.status(401).json({message: "JWT token is missing or invalid"});
        
    }
}

module.exports = { validateDriver };