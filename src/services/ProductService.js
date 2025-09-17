const Product = require('../models/Product');
const fs = require('fs');
const path = require('path');

/**
 * Product service with JSON file-based product storage
 * In a real application, this would connect to a database
 */
class ProductService {
    constructor() {
        this.products = new Map();
        this.productsFilePath = path.join(__dirname, '../data/products.json');
        this.initializeProducts();
    }

    /**
     * Get all products
     */
    getAllProducts() {
        return Array.from(this.products.values());
    }

    /**
     * Get product by ID
     */
    getProductById(id) {
        return this.products.get(parseInt(id));
    }

    /**
     * Check if product exists
     */
    productExists(id) {
        return this.products.has(parseInt(id));
    }

    /**
     * Check if product is in stock
     */
    isProductInStock(id) {
        const product = this.getProductById(id);
        return product ? product.inStock : false;
    }

    /**
     * Create a new product
     */
    createProduct(productData) {
        const product = new Product(
            productData.id,
            productData.name,
            productData.description,
            productData.basePrice,
            productData.category,
            productData.inStock,
            productData.imageUrl,
            productData.eventDate,
            productData.location,
            productData.duration,
            productData.components,
            productData.emiOptions
        );
        this.products.set(product.id, product);
        return product;
    }

    /**
     * Update product
     */
    updateProduct(id, productData) {
        const product = this.getProductById(id);
        if (!product) {
            throw new Error('Product not found');
        }

        Object.assign(product, productData);
        return product;
    }

    /**
     * Delete product
     */
    deleteProduct(id) {
        return this.products.delete(parseInt(id));
    }

    /**
     * Load products from JSON file
     */
    loadProductsFromFile() {
        try {
            if (fs.existsSync(this.productsFilePath)) {
                const fileContent = fs.readFileSync(this.productsFilePath, 'utf8');
                const productsData = JSON.parse(fileContent);
                
                // Clear existing products
                this.products.clear();
                
                // Load products from JSON
                productsData.forEach(productData => {
                    this.createProduct(productData);
                });
                
                console.log(`✅ Loaded ${productsData.length} products from JSON file`);
            } else {
                console.warn('⚠️ Products JSON file not found, using empty product list');
            }
        } catch (error) {
            console.error('❌ Error loading products from JSON file:', error.message);
            // Fallback to empty product list
            this.products.clear();
        }
    }

    /**
     * Initialize products from JSON file
     */
    initializeProducts() {
        this.loadProductsFromFile();
    }

    /**
     * Reload products from JSON file (useful for development)
     */
    reloadProducts() {
        this.loadProductsFromFile();
    }
}

module.exports = ProductService;
