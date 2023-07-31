const { verify } = require('jsonwebtoken');
require('dotenv').config();
const validateToken = (req, res, next) => {
    try {
        const accessToken = req.header("Authorization").split(" ")[1];

        // handle no token/ invalid token
        if (!accessToken) {
            return res.status(401).json({message: "JWT token is required"});
        }
        
        // if token is valid
        const payload = verify(accessToken, process.env.APP_SECRET);
        if (payload.type != "session") {
            return res.status(401).json({message: "JWT token is not the correct type"});
        }
        req.user = payload.user;
        return next();
    }
    catch (err) {
        return res.status(401).json({message: "JWT token is missing or invalid"});
    }
}
module.exports = { validateToken };