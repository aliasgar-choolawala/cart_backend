const { v4: uuidv4 } = require('uuid');
const CartItem = require('./CartItem');
const Product = require('./Product');

/**
 * Cart model representing a user's shopping cart
 */
class Cart {
    constructor(userId) {
        this.id = uuidv4();
        this.userId = userId;
        this.items = [];
        this.totalAmount = 0;
        this.itemCount = 0;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    /**
     * Add item to cart or update quantity if item already exists
     */
    addItem(product, quantity) {
        if (!product || quantity <= 0) {
            throw new Error('Invalid product or quantity');
        }

        // Check if item already exists in cart
        const existingItem = this.findItemByProductId(product.id);
        if (existingItem) {
            existingItem.updateQuantity(existingItem.quantity + quantity);
        } else {
            const cartItem = new CartItem(product, quantity);
            this.items.push(cartItem);
        }

        this.recalculateTotals();
        this.updatedAt = new Date();
    }

    /**
     * Remove item from cart
     */
    removeItem(productId) {
        const initialLength = this.items.length;
        this.items = this.items.filter(item => item.product.id !== productId);
        
        if (this.items.length < initialLength) {
            this.recalculateTotals();
            this.updatedAt = new Date();
            return true;
        }
        return false;
    }

    /**
     * Update item quantity in cart
     */
    updateItemQuantity(productId, quantity) {
        const item = this.findItemByProductId(productId);
        if (!item) {
            return false;
        }

        if (quantity <= 0) {
            return this.removeItem(productId);
        }

        item.updateQuantity(quantity);
        this.recalculateTotals();
        this.updatedAt = new Date();
        return true;
    }

    /**
     * Find cart item by product ID
     */
    findItemByProductId(productId) {
        return this.items.find(item => item.product.id === productId);
    }

    /**
     * Clear all items from cart
     */
    clear() {
        this.items = [];
        this.recalculateTotals();
        this.updatedAt = new Date();
    }

    /**
     * Check if cart is empty
     */
    isEmpty() {
        return this.items.length === 0;
    }

    /**
     * Recalculate total amount and item count
     */
    recalculateTotals() {
        this.totalAmount = this.items.reduce((total, item) => total + item.subtotal, 0);
        this.itemCount = this.items.reduce((count, item) => count + item.quantity, 0);
    }

    /**
     * Get formatted total amount
     */
    getFormattedTotal() {
        return `$${this.totalAmount.toFixed(2)}`;
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
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }

    /**
     * Create from JSON
     */
    static fromJSON(json) {
        const cart = new Cart(json.userId);
        cart.id = json.id;
        cart.items = json.items.map(item => CartItem.fromJSON(item));
        cart.totalAmount = json.totalAmount;
        cart.itemCount = json.itemCount;
        cart.createdAt = new Date(json.createdAt);
        cart.updatedAt = new Date(json.updatedAt);
        return cart;
    }
}

module.exports = Cart;
