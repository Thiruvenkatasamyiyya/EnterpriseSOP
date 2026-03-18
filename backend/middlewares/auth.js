
import User from "../models/User.js";
import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from "./catchAsyncErrors.js";
import jwt from "jsonwebtoken";

// check if user is authenticated or not

export const isAuthenticatedUser = catchAsyncErrors(async(req, res, next) => {
    
    
    
    const {token} = req?.cookies;
    console.log(token);


    if(!token){
        return next(new ErrorHandler("Login first to access the resources",401));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id);

    next();

})

// Authorize user roles

export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)){
           return next(
            new ErrorHandler(`Not allowed`, 403)
           )
        }

        next();

    }
}