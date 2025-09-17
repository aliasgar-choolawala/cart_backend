const express = require('express');
const router = express.Router();
const { cartService } = require('../services');
const { validateRequest, schemas } = require('../middleware/validation');

/**
 * GET /api/users/:userId/cart
 * Get user's cart
 */
router.get('/:userId', (req, res) => {
    try {
        const cart = cartService.getCart(req.params.userId);
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }

        res.json({
            success: true,
            data: cart
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch cart',
            error: error.message
        });
    }
});

/**
 * POST /api/users/:userId/cart
 * Create or get cart for user
 */
router.post('/:userId', (req, res) => {
    try {
        const cart = cartService.getOrCreateCart(req.params.userId);
        res.json({
            success: true,
            data: cart,
            message: 'Cart created/retrieved successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to create/retrieve cart',
            error: error.message
        });
    }
});

/**
 * POST /api/users/:userId/cart/items
 * Add item to cart
 */
router.post('/:userId/items', validateRequest(schemas.addToCart), (req, res) => {
    try {
        const cart = cartService.addItemToCart(
            req.params.userId,
            req.body.productId,
            req.body.quantity
        );

        res.json({
            success: true,
            data: cart,
            message: 'Item added to cart successfully'
        });
    } catch (error) {
        const statusCode = error.message.includes('not found') || 
                          error.message.includes('out of stock') ? 400 : 500;
        res.status(statusCode).json({
            success: false,
            message: error.message
        });
    }
});

/**
 * DELETE /api/users/:userId/cart/items/:productId
 * Remove item from cart
 */
router.delete('/:userId/items/:productId', (req, res) => {
    try {
        const cart = cartService.removeItemFromCart(
            req.params.userId,
            req.params.productId
        );

        res.json({
            success: true,
            data: cart,
            message: 'Item removed from cart successfully'
        });
    } catch (error) {
        const statusCode = error.message.includes('not found') ? 404 : 500;
        res.status(statusCode).json({
            success: false,
            message: error.message
        });
    }
});

/**
 * PUT /api/users/:userId/cart/items/:productId
 * Update item quantity in cart
 */
router.put('/:userId/items/:productId', validateRequest(schemas.updateQuantity), (req, res) => {
    try {
        const cart = cartService.updateItemQuantity(
            req.params.userId,
            req.params.productId,
            req.body.quantity
        );

        res.json({
            success: true,
            data: cart,
            message: 'Item quantity updated successfully'
        });
    } catch (error) {
        const statusCode = error.message.includes('not found') ? 404 : 500;
        res.status(statusCode).json({
            success: false,
            message: error.message
        });
    }
});

/**
 * GET /api/users/:userId/cart/items
 * Get cart items
 */
router.get('/:userId/items', (req, res) => {
    try {
        const items = cartService.getCartItems(req.params.userId);
        res.json({
            success: true,
            data: items,
            count: items.length
        });
    } catch (error) {
        const statusCode = error.message.includes('not found') ? 404 : 500;
        res.status(statusCode).json({
            success: false,
            message: error.message
        });
    }
});

/**
 * DELETE /api/users/:userId/cart
 * Clear cart
 */
router.delete('/:userId', (req, res) => {
    try {
        const cart = cartService.clearCart(req.params.userId);
        res.json({
            success: true,
            data: cart,
            message: 'Cart cleared successfully'
        });
    } catch (error) {
        const statusCode = error.message.includes('not found') ? 404 : 500;
        res.status(statusCode).json({
            success: false,
            message: error.message
        });
    }
});

/**
 * GET /api/users/:userId/cart/summary
 * Get cart summary
 */
router.get('/:userId/summary', (req, res) => {
    try {
        const summary = cartService.getCartSummary(req.params.userId);
        if (!summary) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }

        res.json({
            success: true,
            data: summary
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch cart summary',
            error: error.message
        });
    }
});

module.exports = router;
