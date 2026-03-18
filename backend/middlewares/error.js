export default (err,req,res,next) =>{

    let error = {
        message : err.message || "Internal Server Error",
        statusCode : err.statusCode || 500
    }

        res.status(error.statusCode).json({
            message : error.message,
            error : err
        })
    
}

