# Cart Backend API Documentation

## Overview
The cart_backend now provides 3 sports/event packages that support the cart_frontend with flexible pricing options and EMI support.

## Products Available

### 1. Singapore F1 Grand Prix
- **Base Price**: ₹45,000
- **Event Date**: 2024-09-15
- **Duration**: 3 days / 2 nights
- **Location**: Marina Bay Circuit, Singapore

### 2. Liverpool vs Manchester United
- **Base Price**: ₹35,000
- **Event Date**: 2024-10-20
- **Duration**: 4 days / 3 nights
- **Location**: Anfield Stadium, Liverpool

### 3. French Open Tennis Championship
- **Base Price**: ₹55,000
- **Event Date**: 2024-05-26
- **Duration**: 5 days / 4 nights
- **Location**: Roland Garros, Paris

## API Endpoints

### Get All Products
```
GET /api/products
```
Returns all 3 sports/event packages with complete details including components and EMI options.

### Get Product by ID
```
GET /api/products/:id
```
Returns specific product details.

### Calculate Price
```
POST /api/products/:id/calculate-price
Content-Type: application/json

{
  "selectedComponents": {
    "flights": true,
    "hotel": true
  }
}
```
Calculates total price based on selected components. Match tickets are always included (mandatory).

### Get EMI Options
```
GET /api/products/:id/emi-options
```
Returns available EMI options for the product.

### Calculate EMI
```
POST /api/products/:id/emi-calculation
Content-Type: application/json

{
  "totalAmount": 55000,
  "tenure": 6
}
```
Calculates monthly EMI amount for given tenure.

## Component Structure

Each product has the following components:

### Match Tickets (Mandatory)
- Always included in the price
- Cannot be deselected
- Different prices for each event

### Flights (Optional)
- Return flights from major Indian cities
- Can be added to the package
- Different prices for each destination

### Hotel (Optional)
- Accommodation for the event duration
- Can be added to the package
- Different prices and durations

## EMI Options

All products support 0% EMI for:
- **6 months**: 0% interest, 0% processing fee
- **12 months**: 0% interest, 0% processing fee

## Example Usage

### Get all products
```bash
curl http://localhost:3001/api/products
```

### Calculate price for Singapore F1 with flights and hotel
```bash
curl -X POST http://localhost:3001/api/products/1/calculate-price \
  -H "Content-Type: application/json" \
  -d '{"selectedComponents": {"flights": true, "hotel": true}}'
```

### Calculate 6-month EMI for ₹55,000
```bash
curl -X POST http://localhost:3001/api/products/1/emi-calculation \
  -H "Content-Type: application/json" \
  -d '{"totalAmount": 55000, "tenure": 6}'
```

## Frontend Integration

The cart_frontend can now:
1. Display all 3 sports/event packages
2. Allow users to select optional components (flights, hotel)
3. Calculate total price dynamically
4. Show EMI options (6/12 months at 0% interest)
5. Display pricing breakdown for selected components

## Server Information

- **Port**: 3001
- **Health Check**: http://localhost:3001/health
- **Environment**: Development
