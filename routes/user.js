module.exports = (app) => {
    try {
        //User Validation
        const userValidation = require("../validation/user/userValidation")()

        //User Controllers
        const user = require("../controllers/user")()

        app.post("/user/register", userValidation.registerUser, user.registration)

        app.post("/user/login", userValidation.loginUser, user.login)

        app.post('/user/forgotpassword', userValidation.checkEmail, user.forgotPassword)

        app.post('/user/changeForgotPassword', userValidation.forgotPassword, user.changeForgotPassword)

        app.post('/user/logout', userValidation.checkId, user.logout)

    } catch (e) {
        console.log(`Error in user route: ${e}`)
    }
};