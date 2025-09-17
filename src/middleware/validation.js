const Joi = require('joi');

/**
 * Validation middleware for request validation
 */
const validateRequest = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: error.details.map(detail => detail.message)
            });
        }
        next();
    };
};

/**
 * Validation schemas
 */
const schemas = {
    addToCart: Joi.object({
        productId: Joi.number().integer().positive().required(),
        quantity: Joi.number().integer().positive().required()
    }),

    updateQuantity: Joi.object({
        quantity: Joi.number().integer().positive().required()
    }),

    createProduct: Joi.object({
        name: Joi.string().min(1).max(255).required(),
        description: Joi.string().min(1).max(1000).required(),
        price: Joi.number().positive().required(),
        category: Joi.string().min(1).max(100).required(),
        inStock: Joi.boolean().required(),
        imageUrl: Joi.string().uri().required()
    }),

    checkout: Joi.object({
        shippingAddress: Joi.object({
            street: Joi.string().min(1).max(255).required(),
            city: Joi.string().min(1).max(100).required(),
            state: Joi.string().min(1).max(100).required(),
            zipCode: Joi.string().min(1).max(20).required(),
            country: Joi.string().min(1).max(100).required()
        }).required(),
        billingAddress: Joi.object({
            street: Joi.string().min(1).max(255).required(),
            city: Joi.string().min(1).max(100).required(),
            state: Joi.string().min(1).max(100).required(),
            zipCode: Joi.string().min(1).max(20).required(),
            country: Joi.string().min(1).max(100).required()
        }).required()
    })
};

module.exports = {
    validateRequest,
    schemas
};
