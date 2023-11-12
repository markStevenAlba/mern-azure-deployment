const jwt = require('jsonwebtoken');
const asyncHandler = require('./asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/user');

const protect = asyncHandler(async (req, res, next) => {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split("Bearer ")[1];
    } else {
        return res.status(403).json({ text: 'Unauthorized', type: 'error' });
    }

    if (!token) {
        return res.status(403).json({
            text: "No token provided!",
            type: 'error'
        });
    }

    try {
        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(401).json({ text: 'Unauthorized', type: 'error' });
            }

            let user = await User.findById(decoded.id, { password: 0 });

            req.user = user;
            req.userId = user._id;
            req.groupId = user.group;
            next();
        });
    } catch (error) {
        console.log(JSON.stringify({ message: 'invalidToken', errorMessage: error.message, errorTitle: error.name }));
        return next(new ErrorResponse(401, "Session expired please relogin"));
    }
});

const authorize = (...roles) => (req, res, next) => {
    if (!roles.includes(req.user.role) && req.user.role !== 'super') {
        return next(new ErrorResponse(403, "Unauthorized Role Access"));
    }
    next();
};

module.exports = {
    protect,
    authorize
};
