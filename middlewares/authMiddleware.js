const {promisify} = require('util');
const jwt = require('jsonwebtoken');

exports.protectRoute = async (req, res, next) => {
    let token;

    // Check to see whether token available or not
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    
    if(!token) throw res.status(401).json({
        status: 'fail',
        message: 'No token, authorization denied!'
    });
    // Verification the token
    let decoded;
    try {
        decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
        req.user = decoded;
    } catch (err) {
        res.status(401).json({
            status: 'fail',
            message: 'Token is not valid, authorization denied!'
        })
    }
    // If the user does not exist after the token is issued
    const freshUser = await User.findById(decoded?.id);

    if(!freshUser) throw res.status(404).json({
        status: 'fail',
        message: 'The user belonging this token does not exist anymore!'
    });
    next();
}