const express = require('express');
const router = express.Router();
const authController = require('./../modules/auth/auth-controller');
const { body } = require('express-validator');


router.post('/create',
    body('firstName')
        .trim()
        .notEmpty(),
    body('lastName')
        .trim()
        .notEmpty(),
    body('email')
        .trim()
        .notEmpty()
        .isEmail(),
    body('password')
        .trim()
        .notEmpty()
        .isStrongPassword({
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1
        }),
    authController.signUpUser );

router.post('/password',
    body('email')
        .trim()
        .notEmpty()
        .isEmail(),
    authController.passwordLogin );


    
router.post('/reset-password',
    body('email')
        .trim()
        .notEmpty()
        .isEmail(),
    authController.resetPassword );

router.post('/token/exchange', authController.exchangeToken );

router.post('/new-password',
    body('password')
        .trim()
        .notEmpty()
        
        .isStrongPassword({
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1
        }),
    body('token')
        .trim()
        .notEmpty(),
    authController.setNewPassword );

router.post('/verify-email');

module.exports = router;
