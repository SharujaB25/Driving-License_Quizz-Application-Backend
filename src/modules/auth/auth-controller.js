const { validationResult } = require('express-validator');
const responseFormat = require('./../../utils/response-formatter');
const userService = require('./../../services/user-service');
const { validateUserPassword, generateTokenPair, verifyGoogleToken, verifyFacebookToken } = require('../../services/auth-service');
const mailService = require('./../../services/email-service');


const APP_URL = process.env.APP_URL;

async function passwordLogin( req, res ) {

    const result = validationResult(req);

    if ( !result.isEmpty()) {
        console.log(result)
        return res.status(400).send( responseFormat.ErrorResponse( result.errors ));
    }

    const  { email, password } = req.body;

    const user = await userService.getUserByEmail(email);
    
    if ( !user ) {
        return res.status(403).send( responseFormat.ErrorResponse('invalid_credentials'));
    }

    if ( !user.isPasswordAuth()) {
        return res.status(403).send( responseFormat.ErrorResponse('invalid_auth_method'));
    }    

    const isValid = await validateUserPassword( password, user );

    if ( !isValid ) {
        return res.status(403).send( responseFormat.ErrorResponse('invalid_credentials'));
    }

    const [ accessToken, refreshToken ] = await generateTokenPair( user );

    return res.send( responseFormat.SuccessResponse({
        accessToken,
        refreshToken
    }));
}

async function signUpUser( req, res ) {

    const result = validationResult(req);

    if ( !result.isEmpty()) {
        return res.status(400).send(result.errors)
    }

    const { email, password, firstName, lastName } = req.body;

    let user = await userService.getUserByEmail(email);

    if ( user ) {
        return res.status(400).send( responseFormat.ErrorResponse('user_already_exist'));
    }

    user = await userService.createUserWithPassword( firstName, lastName, email, password );
    return res.send( responseFormat.SuccessResponse(user));
}

async function exchangeToken( req, res ) {

    const { socialAccessToken, platform } = req.body;
    let data;

    if ( platform === 'google' ) {
        data = await verifyGoogleToken(socialAccessToken);
    } else if ( platform === 'facebook' ) {
        data = await verifyFacebookToken(socialAccessToken);
    } else {
        return res.status(400).send( responseFormat.ErrorResponse('invalid_social_platform'));
    }

    let user = await userService.getUserByEmail( data.email );
    
    if ( !user ) {
        user = await userService.createUserWithSocialAccount(
            data.firstName,
            data.lastName,
            data.email,
            data.platform,
        )
    }

    if ( user.isPasswordAuth()) {
        return res.status(400).send( responseFormat.ErrorResponse('invalid_auth_type'));
    }

    const [ accessToken, refreshToken ] = await generateTokenPair( user );

    return res.send( responseFormat.SuccessResponse({
        accessToken,
        refreshToken
    }));
}

async function resetPassword( req, res ) {

    const result = validationResult(req);

    if ( !result.isEmpty()) {
        return res.status(400).send( responseFormat.ErrorResponse( result.errors ));
    }

    const { email } = req.body;

    let user = await userService.getUserByEmail( email );

    if ( !user ) {
        return res.status(400).send( responseFormat.ErrorResponse('user_not_exist'));
    }

    if ( !user.isPasswordAuth()) {
        return res.status(400).send( responseFormat.ErrorResponse('invalid_operation'));
    }

    user = await userService.setPasswordRecoveryMode( user );

    const mail = await mailService.send({
        from: {
            email: 'bbalendrakumar@gmail.com',
            name: 'Banujan Balendrakumar',
        },
        to: {
            email: user.email,
            name: user.fullName(),
        },
        subject: 'Password Reset',
        body: `<a href='http://localhost:3000/reset?token=${user.resetPasswordToken}'>Click here to reset password</a>`
    });

    return res.send( responseFormat.SuccessResponse('OK'));
}

async function setNewPassword( req, res ) {

    const result = validationResult(req);

    if ( !result.isEmpty()) {
        return res.status(400).send( responseFormat.ErrorResponse( result.errors ));
    }

    const { password, token } = req.body;

    const user = await userService.getUserByResetPasswordToken( token );
    
    if ( !user ) {
        return res.status(400).send( responseFormat.ErrorResponse('invalid_reset_token'));
    }

    await userService.setNewPassword( user, password );

    return res.send( responseFormat.SuccessResponse('Password Updated'));
}

module.exports = {
    passwordLogin,
    signUpUser,
    exchangeToken,
    resetPassword,
    setNewPassword
}
    





