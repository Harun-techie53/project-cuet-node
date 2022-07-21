const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Course = require('../models/courseModel');
const APIFeatures = require('../utils/apiFeatures');
const User = require('../models/userModel');

exports.getCheckoutSession = async (req, res) => {
    try {
        const features = new APIFeatures(Course.find(), req.query).filter();
        const courses = await features.query;

        const user = await User.findById(req.user.id);

        let modifiedCourses = [];

        courses.forEach((course) => (
            modifiedCourses.unshift({
                name: course.name,
                description: `Credit: ${course.credit}, Level: ${course.level}, Term: ${course.term}`,
                amount: course.price * 100,
                currency: 'usd',
                quantity: 1
            })
        ));

        const session = await stripe.checkout.sessions.create({
            mode: 'payment',
            payment_method_types: ['card'],
            success_url: `${req.protocol}://${req.get('host')}`,
            cancel_url: `${req.protocol}://${req.get('host')}/courses/enroll`,
            customer_email: user.email,
            line_items: [ ...modifiedCourses ]
        });

        res.status(200).json({
            status: 'success',
            session
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
}

exports.getCourses = async (req, res) => {
    try {
        const features = new APIFeatures(Course.find(), req.query).filter();
        const courses = await features.query;
        res.status(200).json({
            status: 'success',
            results: courses.length,
            data: { 
                courses
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        })
    }
}

exports.createCourse = async (req, res) => {
    try {
        res.status(200).json({
            status: 'success',
            data: { 
                course: 'All the courses here..'
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        })
    }
}
