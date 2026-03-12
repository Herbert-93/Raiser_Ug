exports.errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    console.error(err);

    if (err.code === 'PGRST116') {
        const message = 'Resource not found';
        error = { message, statusCode: 404 };
    }

    if (err.code === '23505') {
        const message = 'Duplicate field value entered';
        error = { message, statusCode: 400 };
    }

    if (err.code === '23502') {
        const message = 'Missing required field';
        error = { message, statusCode: 400 };
    }

    res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Server Error'
    });
};
