/**
 * Product model representing sports/event packages that can be added to cart
 */
class Product {
    constructor(id, name, description, basePrice, category, inStock, imageUrl, eventDate, location, duration, components, emiOptions) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.basePrice = basePrice;
        this.category = category;
        this.inStock = inStock;
        this.imageUrl = imageUrl;
        this.eventDate = eventDate;
        this.location = location;
        this.duration = duration;
        this.components = components || {};
        this.emiOptions = emiOptions || { available: false };
    }

    /**
     * Create product from JSON object
     */
    static fromJSON(json) {
        return new Product(
            json.id,
            json.name,
            json.description,
            json.basePrice,
            json.category,
            json.inStock,
            json.imageUrl,
            json.eventDate,
            json.location,
            json.duration,
            json.components,
            json.emiOptions
        );
    }

    /**
     * Convert product to JSON
     */
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            basePrice: this.basePrice,
            category: this.category,
            inStock: this.inStock,
            imageUrl: this.imageUrl,
            eventDate: this.eventDate,
            location: this.location,
            duration: this.duration,
            components: this.components,
            emiOptions: this.emiOptions
        };
    }

    /**
     * Check if product is available
     */
    isAvailable() {
        return this.inStock;
    }

    /**
     * Get formatted price
     */
    getFormattedPrice() {
        return `₹${this.basePrice.toLocaleString()}`;
    }

    /**
     * Calculate total price based on selected components
     */
    calculateTotalPrice(selectedComponents = {}) {
        let total = 0;
        
        // Add base price (match tickets are mandatory)
        if (this.components.matchTickets) {
            total += this.components.matchTickets.price;
        }
        
        // Add optional components
        if (selectedComponents.flights && this.components.flights) {
            total += this.components.flights.price;
        }
        
        if (selectedComponents.hotel && this.components.hotel) {
            total += this.components.hotel.price;
        }
        
        return total;
    }

    /**
     * Get EMI calculation
     */
    getEMICalculation(totalAmount, tenure) {
        if (!this.emiOptions.available || !this.emiOptions.tenure.includes(tenure)) {
            return null;
        }
        
        const monthlyAmount = totalAmount / tenure;
        return {
            tenure,
            monthlyAmount: Math.round(monthlyAmount),
            totalAmount,
            interestRate: this.emiOptions.interestRate,
            processingFee: this.emiOptions.processingFee
        };
    }
}

module.exports = Product;
