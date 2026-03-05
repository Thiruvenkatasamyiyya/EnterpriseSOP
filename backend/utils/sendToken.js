export default (user, statusCode, res) => {

    // Create JWT Token

    const token = user.getJwtToken();

    // Option for cookies
    const options = {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000
        ),
        httpOnly:true,
        secure:false,
    };

    res.status(statusCode).cookie("token", token, options).json({
        token
    })

}