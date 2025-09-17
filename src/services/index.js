const ProductService = require('./ProductService');
const CartService = require('./CartService');
const OrderService = require('./OrderService');

// Create shared service instances
const productService = new ProductService();
const cartService = new CartService(productService);
const orderService = new OrderService(cartService);

module.exports = {
    productService,
    cartService,
    orderService
};
