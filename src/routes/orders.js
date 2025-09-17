const express = require('express');
const router = express.Router();
const { orderService } = require('../services');
const { validateRequest, schemas } = require('../middleware/validation');

/**
 * POST /api/users/:userId/orders
 * Create order (checkout)
 */
router.post('/:userId', validateRequest(schemas.checkout), (req, res) => {
    try {
        const order = orderService.createOrder(
            req.params.userId,
            req.body.shippingAddress,
            req.body.billingAddress
        );

        res.status(201).json({
            success: true,
            data: order,
            message: 'Order created successfully'
        });
    } catch (error) {
        const statusCode = error.message.includes('not found') || 
                          error.message.includes('empty cart') ||
                          error.message.includes('required') ? 400 : 500;
        res.status(statusCode).json({
            success: false,
            message: error.message
        });
    }
});

/**
 * GET /api/orders/:orderId
 * Get order by ID
 */
router.get('/:orderId', (req, res) => {
    try {
        const order = orderService.getOrder(req.params.orderId);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.json({
            success: true,
            data: order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch order',
            error: error.message
        });
    }
});

/**
 * GET /api/users/:userId/orders
 * Get orders by user ID
 */
router.get('/user/:userId', (req, res) => {
    try {
        const orders = orderService.getOrdersByUser(req.params.userId);
        res.json({
            success: true,
            data: orders,
            count: orders.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch orders',
            error: error.message
        });
    }
});

/**
 * PUT /api/orders/:orderId/status
 * Update order status
 */
router.put('/:orderId/status', (req, res) => {
    try {
        const { status } = req.body;
        if (!status) {
            return res.status(400).json({
                success: false,
                message: 'Status is required'
            });
        }

        const order = orderService.updateOrderStatus(req.params.orderId, status);
        res.json({
            success: true,
            data: order,
            message: 'Order status updated successfully'
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
 * GET /api/orders/:orderId/summary
 * Get order summary
 */
router.get('/:orderId/summary', (req, res) => {
    try {
        const summary = orderService.getOrderSummary(req.params.orderId);
        if (!summary) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.json({
            success: true,
            data: summary
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch order summary',
            error: error.message
        });
    }
});

/**
 * GET /api/orders/stats
 * Get order statistics
 */
router.get('/stats', (req, res) => {
    try {
        const stats = orderService.getOrderStats();
        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch order statistics',
            error: error.message
        });
    }
});

module.exports = router;
