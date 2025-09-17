const express = require('express');
const router = express.Router();
const { productService } = require('../services');
const { validateRequest, schemas } = require('../middleware/validation');

/**
 * GET /api/products
 * Get all products
 */
router.get('/', (req, res) => {
    try {
        const products = productService.getAllProducts();
        res.json({
            success: true,
            data: products,
            count: products.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch products',
            error: error.message
        });
    }
});

/**
 * GET /api/products/:id
 * Get product by ID
 */
router.get('/:id', (req, res) => {
    try {
        const product = productService.getProductById(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch product',
            error: error.message
        });
    }
});

/**
 * POST /api/products
 * Create new product
 */
router.post('/', validateRequest(schemas.createProduct), (req, res) => {
    try {
        const product = productService.createProduct(req.body);
        res.status(201).json({
            success: true,
            data: product,
            message: 'Product created successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to create product',
            error: error.message
        });
    }
});

/**
 * PUT /api/products/:id
 * Update product
 */
router.put('/:id', (req, res) => {
    try {
        const product = productService.updateProduct(req.params.id, req.body);
        res.json({
            success: true,
            data: product,
            message: 'Product updated successfully'
        });
    } catch (error) {
        const statusCode = error.message === 'Product not found' ? 404 : 500;
        res.status(statusCode).json({
            success: false,
            message: error.message
        });
    }
});

/**
 * DELETE /api/products/:id
 * Delete product
 */
router.delete('/:id', (req, res) => {
    try {
        const deleted = productService.deleteProduct(req.params.id);
        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete product',
            error: error.message
        });
    }
});

/**
 * GET /api/products/:id/stock
 * Check if product is in stock
 */
router.get('/:id/stock', (req, res) => {
    try {
        const inStock = productService.isProductInStock(req.params.id);
        res.json({
            success: true,
            data: {
                productId: parseInt(req.params.id),
                inStock
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to check product stock',
            error: error.message
        });
    }
});

/**
 * POST /api/products/:id/calculate-price
 * Calculate total price based on selected components
 */
router.post('/:id/calculate-price', (req, res) => {
    try {
        const product = productService.getProductById(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        const { selectedComponents = {} } = req.body;
        const totalPrice = product.calculateTotalPrice(selectedComponents);
        
        res.json({
            success: true,
            data: {
                productId: parseInt(req.params.id),
                selectedComponents,
                totalPrice,
                formattedPrice: `₹${totalPrice.toLocaleString()}`
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to calculate price',
            error: error.message
        });
    }
});

/**
 * POST /api/products/:id/emi-calculation
 * Calculate EMI options for a given amount
 */
router.post('/:id/emi-calculation', (req, res) => {
    try {
        const product = productService.getProductById(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        const { totalAmount, tenure } = req.body;
        const emiCalculation = product.getEMICalculation(totalAmount, tenure);
        
        if (!emiCalculation) {
            return res.status(400).json({
                success: false,
                message: 'EMI not available for this product or tenure'
            });
        }

        res.json({
            success: true,
            data: emiCalculation
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to calculate EMI',
            error: error.message
        });
    }
});

/**
 * GET /api/products/:id/emi-options
 * Get available EMI options for a product
 */
router.get('/:id/emi-options', (req, res) => {
    try {
        const product = productService.getProductById(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.json({
            success: true,
            data: {
                productId: parseInt(req.params.id),
                emiOptions: product.emiOptions
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to get EMI options',
            error: error.message
        });
    }
});

module.exports = router;
