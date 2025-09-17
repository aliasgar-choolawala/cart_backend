const Product = require('./Product');

/**
 * Cart item model representing a product with quantity in the cart
 */
class CartItem {
    constructor(product, quantity) {
        this.product = product instanceof Product ? product : Product.fromJSON(product);
        this.quantity = quantity;
        this.subtotal = this.calculateSubtotal();
    }

    /**
     * Calculate subtotal for this cart item
     */
    calculateSubtotal() {
        return this.product.price * this.quantity;
    }

    /**
     * Update quantity and recalculate subtotal
     */
    updateQuantity(quantity) {
        this.quantity = quantity;
        this.subtotal = this.calculateSubtotal();
    }

    /**
     * Get formatted subtotal
     */
    getFormattedSubtotal() {
        return `$${this.subtotal.toFixed(2)}`;
    }

    /**
     * Convert to JSON
     */
    toJSON() {
        return {
            product: this.product.toJSON(),
            quantity: this.quantity,
            subtotal: this.subtotal
        };
    }

    /**
     * Create from JSON
     */
    static fromJSON(json) {
        return new CartItem(json.product, json.quantity);
    }
}

module.exports = CartItem;
