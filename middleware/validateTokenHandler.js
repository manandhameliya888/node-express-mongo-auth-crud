// This is used as try-catch of the express async code
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');


const validateToken = asyncHandler(async (req, res, next) => {
    let token;
    // Token can come from Header inside Authorization key OR can be come from Auth/Authorization Tab of Postman in Bearer token directly
    let authHeader = req.headers.Authorization || req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer")) {
        token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decoded) => {
            if (error) {
                res.status(401);
                throw new Error("User is not Authorized!");
            }
            req.user = decoded.user;
            next();
            // console.log("Decoded Data: ", decoded);
        });

        if (!token) {
            res.status(401);
            throw new Error("User is not Authorized or Token is Missing!");
        }
    } else {
        res.status(401);
        throw new Error("User is not Authorized or Token is Missing!");
    }
});

module.exports = validateToken;