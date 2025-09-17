const Cart = require('../models/Cart');
const Product = require('../models/Product');

/**
 * Cart service with in-memory cart storage
 * In a real application, this would connect to a database
 */
class CartService {
    constructor(productService) {
        this.carts = new Map();
        this.productService = productService;
    }

    /**
     * Get cart by user ID
     */
    getCart(userId) {
        return this.carts.get(userId);
    }

    /**
     * Create a new cart for user
     */
    createCart(userId) {
        const cart = new Cart(userId);
        this.carts.set(userId, cart);
        return cart;
    }

    /**
     * Get or create cart for user
     */
    getOrCreateCart(userId) {
        let cart = this.getCart(userId);
        if (!cart) {
            cart = this.createCart(userId);
        }
        return cart;
    }

    /**
     * Add item to cart
     */
    addItemToCart(userId, productId, quantity) {
        const product = this.productService.getProductById(productId);
        if (!product) {
            throw new Error('Product not found');
        }

        if (!product.inStock) {
            throw new Error('Product is out of stock');
        }

        const cart = this.getOrCreateCart(userId);
        cart.addItem(product, quantity);
        return cart;
    }

    /**
     * Remove item from cart
     */
    removeItemFromCart(userId, productId) {
        const cart = this.getCart(userId);
        if (!cart) {
            throw new Error('Cart not found');
        }

        const removed = cart.removeItem(parseInt(productId));
        if (!removed) {
            throw new Error('Product not found in cart');
        }

        return cart;
    }

    /**
     * Update item quantity in cart
     */
    updateItemQuantity(userId, productId, quantity) {
        const cart = this.getCart(userId);
        if (!cart) {
            throw new Error('Cart not found');
        }

        const updated = cart.updateItemQuantity(parseInt(productId), quantity);
        if (!updated) {
            throw new Error('Product not found in cart');
        }

        return cart;
    }

    /**
     * Get cart items
     */
    getCartItems(userId) {
        const cart = this.getCart(userId);
        if (!cart) {
            throw new Error('Cart not found');
        }

        return cart.items;
    }

    /**
     * Clear cart
     */
    clearCart(userId) {
        const cart = this.getCart(userId);
        if (!cart) {
            throw new Error('Cart not found');
        }

        cart.clear();
        return cart;
    }

    /**
     * Delete cart
     */
    deleteCart(userId) {
        return this.carts.delete(userId);
    }

    /**
     * Check if cart exists
     */
    cartExists(userId) {
        return this.carts.has(userId);
    }

    /**
     * Get cart summary
     */
    getCartSummary(userId) {
        const cart = this.getCart(userId);
        if (!cart) {
            return null;
        }

        return {
            id: cart.id,
            userId: cart.userId,
            itemCount: cart.itemCount,
            totalAmount: cart.totalAmount,
            formattedTotal: cart.getFormattedTotal(),
            isEmpty: cart.isEmpty(),
            updatedAt: cart.updatedAt
        };
    }
}

module.exports = CartService;
