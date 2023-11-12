const express = require('express');
const {
    createUser,
    generateOtp,
    signin,
    getUserData,
    createSocialsUser
} = require('../controllers/authControllers.js');
const { authorize, protect } = require('../middlewares/auth.js');
const router = express.Router();

router.route('/').get([
    protect,
    getUserData
]);

router.route('/signup').post([
    // protect,
    // authorize('admin'), 
    createUser
]);

router.route('/socials').post([
    // protect,
    // authorize('admin'), 
    createSocialsUser
]);

router.route('/signin').post(signin);

router.route('/generate-otp').post([
    protect,
    authorize('user'),
    generateOtp
]);

module.exports = router;
