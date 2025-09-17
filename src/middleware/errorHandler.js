/**
 * Global error handling middleware
 */
const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);

    // Default error response
    let statusCode = 500;
    let message = 'Internal server error';

    // Handle specific error types
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = 'Validation error';
    } else if (err.name === 'CastError') {
        statusCode = 400;
        message = 'Invalid ID format';
    } else if (err.message.includes('not found')) {
        statusCode = 404;
        message = err.message;
    } else if (err.message.includes('already exists')) {
        statusCode = 409;
        message = err.message;
    } else if (err.message.includes('out of stock')) {
        statusCode = 400;
        message = err.message;
    } else if (err.message.includes('empty cart')) {
        statusCode = 400;
        message = err.message;
    } else if (err.message.includes('required')) {
        statusCode = 400;
        message = err.message;
    }

    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

/**
 * 404 handler for undefined routes
 */
const notFoundHandler = (req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`
    });
};

module.exports = {
    errorHandler,
    notFoundHandler
};
