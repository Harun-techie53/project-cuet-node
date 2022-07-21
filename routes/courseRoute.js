const express = require('express');
const router = express.Router();
const { getCourses, createCourse, getCheckoutSession } = require('../controllers/courseController');
const { protectRoute } = require('../middlewares/authMiddleware');

router
    .route('/')
    .get(getCourses)
    .post(createCourse);

router.get('/checkout-session', protectRoute, getCheckoutSession);

module.exports = router;