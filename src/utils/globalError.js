import ApiError from './ApiError.js';

const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path}:${err.value}.`
    return new ApiError(400,message)
}

const handleDuplicateFieldDB = (err) => {
    const value = err.keyValue.title;
    const message = `Duplicate Field value : ${value} Please use another value !`;
    return new ApiError(400,message)
}

const validationErrorDB = (err) => {
    const errors = Object.values(err.errors).map(el => el.message)
    const message = `${errors[0]} `;
    return new ApiError( 400,message)
}
const handleJWTError = () => new ApiError( 401,'Invalid token please login again');

const handleJWTExpired = () => new ApiError( 401,'Token Expired please login again');

const sendErrorDev = (err, res) => {
    console.log('ERRRRORORR')
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        stack: err.stack,
        error: err
    })
}

const sendErrorProd = (err, res) => {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        })
    }
    else {
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong !!!'
        })
    }
}

const globalErrorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || false;
    if (process.env.NODE_ENV === 'production') {
       let error = err;
       if (error.name === 'CastError') { error = handleCastErrorDB(error); }
       if (error.code === 11000) { error = handleDuplicateFieldDB(error); }
       if (error.name === 'ValidationError') { error = validationErrorDB(error); }
       if (error.name === 'JsonWebTokenError') { error = handleJWTError(); }
       if (error.name === 'TokenExpiredError') { error = handleJWTExpired(); }

       sendErrorProd(error, res)
   }
    else {
        sendErrorDev(err, res)

    }

}

export default globalErrorHandler