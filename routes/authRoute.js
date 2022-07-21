const express = require('express');
const router = express.Router();
const { 
    getAllUsers, 
    signUp, 
    signIn,
    getCurrentUser,
    updateCurrentUser,
    deleteCurrentUser,
    uploadUserPhoto,
    resizeUserPhoto,
    getUserPhoto
} = require('../controllers/authController');
const { protectRoute } = require('../middlewares/authMiddleware');

router.post('/signIn', signIn);
router.post('/signUp', signUp);
router.get('/users', protectRoute, getAllUsers);
router.get('/me', protectRoute, getCurrentUser);
router.get('/fetchUserPhoto/:file', protectRoute, getUserPhoto);
router.patch(
    '/updateMe', 
    protectRoute, 
    uploadUserPhoto, 
    resizeUserPhoto, 
    updateCurrentUser
);
router.delete('/deleteMe', protectRoute, deleteCurrentUser);

module.exports = router;
