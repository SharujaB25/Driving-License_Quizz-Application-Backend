const { validationResult } = require('express-validator');
const { User, UserLoginType,UserRole } = require('./models/user');

async function signInUser( req, res ) {

    const result = validationResult(req);

    // result = { errors: [...] }

    if ( !result.isEmpty()) {
        return res.status(400).send(result.errors)
    }

    const { email, password } = req.body;

    const user = new User();
    user.email = email;
    user.firstName = "sharu";
    user.lastName = "Bala";
    await user.save();

    return res.send("hello");
}

async function signUpUser( req, res ) {

    const result = validationResult(req);

    // result = { errors: [...] }

    if ( !result.isEmpty()) {
        return res.status(400).send(result.errors)
    }

    const { email, password } = req.body;

    const user = new User();
    user.email = email;
    user.password = password;
    user.firstName = "sharu";
    user.lastName = "Bala";
    user.loginType = UserLoginType.PASSWORD;
    user.role = UserRole.USER;
    await user.save();

    return res.send(user);
}
module.exports = {
    signInUser,
    signUpUser
}
    





