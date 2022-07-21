const RegisteredTerm = require('../models/registeredTermModel');
const Course = require('../models/courseModel');
const APIFeatures = require('../utils/apiFeatures');

exports.getRegisteredTermCourses = async (req, res) => {
    try {
        const registeredCourses = await RegisteredTerm.findOne({ user: req.user.id });
        res.status(200).json({
            status: 'success',
            results: registeredCourses.length,
            registeredCourses
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
}

exports.postRegisteredTermCourses = async (req, res) => {
    try {
        const features = new APIFeatures(Course.find(), req.query).filter();

        const courses = await features.query;


        const registeredCourses = [];

        courses.forEach((course) => (
            registeredCourses.unshift(course.id)
        ));

        await RegisteredTerm.create({
            user: req.user.id,
            courses: registeredCourses
        });

        res.status(200).json({
            status: 'success',
            results: registeredCourses.length,
            registeredCourses
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
}