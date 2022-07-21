const express = require('express');
const router = express.Router();
const { protectRoute } = require('../middlewares/authMiddleware');
const { getRegisteredTermCourses, postRegisteredTermCourses } = require('../controllers/registeredTermController');

router
    .route('/')
    .get(protectRoute, getRegisteredTermCourses)
    .post(protectRoute, postRegisteredTermCourses);

module.exports = router;