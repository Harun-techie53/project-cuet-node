const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const {formattedEmailAndName} = require('../utils');

// const multerStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'public/img/users');
//     },
//     filename: (req, file, cb) => {
//         const ext = file.mimetype.split('/')[1];

//         // user-userId-currenttimestamp.ext
//         cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//     }
// });

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
    if(file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new Error('Forbidden extension!'), false);
    }
}

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});

exports.uploadUserPhoto = upload.single('photo');

exports.resizeUserPhoto = (req, res, next) => {
    if(!req.file) return next();

    req.file.filename = `user-${req.user.id}-${Date.now()}.jpg`;

    sharp(req.file.buffer)
        .resize(260, 260)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/users/${req.file.filename}`);
    
    next();
}

const genJwtToken = (id) => {
    return jwt.sign(
        { id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );
}

const createSendToken = (user, statusCode, res) => {
    const token = genJwtToken(user.id);
    const cookieOptions = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
            ),
        httpOnly: true
    }

    if(process.env.NODE_ENV === 'production') cookieOptions.secure = true;

    res.cookie('jwt', token, cookieOptions);

    //remove password from res body
    user.password = undefined;

    res.status(200).json({
        status: 'success',
        token,
        data: { 
            user
        }
    });
}

exports.getUserPhoto = async (req, res) => {
    try {
        let file = req.params.file;
        let fileLocation = path.join('../public/img/users/', file);
        // res.send({image: fileLocation});
        // res.sendFile(`${fileLocation}`);
        res.sendFile(path.resolve(__dirname, fileLocation));
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
}

exports.getCurrentUser = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user.id);
        res.status(200).json({
            status: 'success',
            data: {
                user: currentUser
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        })
    }
}

exports.updateCurrentUser = async (req, res) => {
    try {
        //firstly format the email and name
        const name = formattedEmailAndName(req.body.email, req.body.name);

        if(req.body.password || req.body.password2) throw new Error('This route is not for password update!');

        const user = await User.findByIdAndUpdate(
            req.user.id, 
            { 
                email: req.body.email, 
                name,
                photo: req.file.filename 
            }, 
            {
                new: true,
                runValidators: true
            }
        );

        res.status(200).json({
            status: 'success',
            data: {
                user
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        })
    }
}

exports.deleteCurrentUser = async (req, res) => {
    try {
        await User.findByIdAndRemove(req.user.id);

        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
}

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({
            status: 'success',
            data: { 
                users
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        })
    }
}

exports.signUp = async (req, res) => {
    const {
        email,
        password,
        passwordConfirm,
        isTeacher
    } = req.body;

    try {
        const name = formattedEmailAndName(email, req.body.name);
        // Check to see whether email or username is unique or not
        let newUser = await User.findOne({ email });
        let newUser2 = await User.findOne({ name });
        if(newUser || newUser2) throw new Error('User is already exist!');

        // create the user with specified fields
        newUser = await User.create({
            name,
            email,
            password,
            passwordConfirm,
            isTeacher
        });

        await createSendToken(newUser, 200, res);
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        })
    }
}

exports.signIn = async (req, res) => {
    const { email, password } = req.body;
    try {
        if(!email || !password) throw new Error('Please, enter your email and password!');

        // Find the user by matching the person's email
        const user = await User.findOne({ email }).select('+password');

        // If the email doesn't match then show error
        if(!user) throw new Error('Please enter correct email and password!');

        const isMatch = await user.correctPassword(password, user.password);

        if(!isMatch) throw new Error('Please enter correct email and password!');

        await createSendToken(user, 200, res);
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: 'Please enter correct email and password!'
        })
    }
}