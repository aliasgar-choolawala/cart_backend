const { v4: uuidv4 } = require('uuid');

/**
 * Order model representing a completed checkout
 */
class Order {
    constructor(userId, cart, shippingAddress, billingAddress) {
        this.id = uuidv4();
        this.userId = userId;
        this.items = [...cart.items]; // Copy cart items
        this.totalAmount = cart.totalAmount;
        this.itemCount = cart.itemCount;
        this.shippingAddress = shippingAddress;
        this.billingAddress = billingAddress;
        this.status = 'pending';
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    /**
     * Update order status
     */
    updateStatus(status) {
        this.status = status;
        this.updatedAt = new Date();
    }

    /**
     * Get formatted total amount
     */
    getFormattedTotal() {
        return `$${this.totalAmount.toFixed(2)}`;
    }

    /**
     * Get order summary
     */
    getSummary() {
        return {
            id: this.id,
            userId: this.userId,
            itemCount: this.itemCount,
            totalAmount: this.totalAmount,
            status: this.status,
            createdAt: this.createdAt
        };
    }

    /**
     * Convert to JSON
     */
    toJSON() {
        return {
            id: this.id,
            userId: this.userId,
            items: this.items.map(item => item.toJSON()),
            totalAmount: this.totalAmount,
            itemCount: this.itemCount,
            shippingAddress: this.shippingAddress,
            billingAddress: this.billingAddress,
            status: this.status,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }

    /**
     * Create from JSON
     */
    static fromJSON(json) {
        const order = new Order(json.userId, { items: json.items }, json.shippingAddress, json.billingAddress);
        order.id = json.id;
        order.totalAmount = json.totalAmount;
        order.itemCount = json.itemCount;
        order.status = json.status;
        order.createdAt = new Date(json.createdAt);
        order.updatedAt = new Date(json.updatedAt);
        return order;
    }
}

module.exports = Order;
