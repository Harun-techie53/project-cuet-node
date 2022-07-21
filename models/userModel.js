const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: [true, 'User should have a username!']
    },
    email: {
        type: String,
        required: [true, 'User should have an email!'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email!']
    },
    photo: {
        type: String,
        default: 'default.jpg'
    },
    password: {
        type: String,
        required: [true, 'User should have a password!'],
        minlength: 8,
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'User should have a password!'],
        minlength: 8,
        validate: {
            validator: function(el) {
                return el === this.password;
            },
            message: 'Password does not match!'
        }
    },
    isTeacher: {
        type: Boolean,
        default: false
    }
});

userSchema.pre('save', async function(next) {
    // if password is not modified then go to next
    if(!this.isModified('password')) return next();

    // if password is modified
    this.password = await bcrypt.hash(this.password, 12);

    //after hashing the password simply delete the confirm password
    this.passwordConfirm = undefined;

    next();
});

userSchema.methods.correctPassword = async function correctPassword(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
}

module.exports = User = mongoose.model('User', userSchema);