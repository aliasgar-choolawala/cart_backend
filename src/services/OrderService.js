const Order = require('../models/Order');

/**
 * Order service for handling checkout and order management
 */
class OrderService {
    constructor(cartService) {
        this.orders = new Map();
        this.cartService = cartService;
    }

    /**
     * Create order from cart (checkout)
     */
    createOrder(userId, shippingAddress, billingAddress) {
        const cart = this.cartService.getCart(userId);
        if (!cart) {
            throw new Error('Cart not found');
        }

        if (cart.isEmpty()) {
            throw new Error('Cannot create order from empty cart');
        }

        // Validate addresses
        this.validateAddress(shippingAddress);
        this.validateAddress(billingAddress);

        // Create order
        const order = new Order(userId, cart, shippingAddress, billingAddress);
        this.orders.set(order.id, order);

        // Clear the cart after successful order creation
        this.cartService.clearCart(userId);

        return order;
    }

    /**
     * Get order by ID
     */
    getOrder(orderId) {
        return this.orders.get(orderId);
    }

    /**
     * Get orders by user ID
     */
    getOrdersByUser(userId) {
        return Array.from(this.orders.values())
            .filter(order => order.userId === userId)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    /**
     * Update order status
     */
    updateOrderStatus(orderId, status) {
        const order = this.getOrder(orderId);
        if (!order) {
            throw new Error('Order not found');
        }

        order.updateStatus(status);
        return order;
    }

    /**
     * Get order summary
     */
    getOrderSummary(orderId) {
        const order = this.getOrder(orderId);
        if (!order) {
            return null;
        }

        return order.getSummary();
    }

    /**
     * Validate address object
     */
    validateAddress(address) {
        if (!address) {
            throw new Error('Address is required');
        }

        const requiredFields = ['street', 'city', 'state', 'zipCode', 'country'];
        for (const field of requiredFields) {
            if (!address[field]) {
                throw new Error(`${field} is required in address`);
            }
        }
    }

    /**
     * Get order statistics
     */
    getOrderStats() {
        const orders = Array.from(this.orders.values());
        const totalOrders = orders.length;
        const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
        const pendingOrders = orders.filter(order => order.status === 'pending').length;
        const completedOrders = orders.filter(order => order.status === 'completed').length;

        return {
            totalOrders,
            totalRevenue,
            pendingOrders,
            completedOrders,
            averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0
        };
    }
}

module.exports = OrderService;
