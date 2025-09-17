# Cart Backend API

A Node.js backend service for cart management and checkout functionality, designed to work with the Next.js frontend application.

## Features

- **Product Management**: CRUD operations for products
- **Cart Operations**: Add, remove, update items in shopping cart
- **Checkout Process**: Create orders with shipping and billing addresses
- **Order Management**: Track and manage orders
- **RESTful API**: Clean and consistent API endpoints
- **Input Validation**: Request validation using Joi
- **Error Handling**: Comprehensive error handling and logging
- **Security**: CORS, Helmet, Rate limiting
- **Performance**: Compression, efficient data structures

## Technology Stack

- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **Joi**: Input validation
- **CORS**: Cross-origin resource sharing
- **Helmet**: Security middleware
- **Morgan**: HTTP request logger
- **Compression**: Response compression
- **Express Rate Limit**: Rate limiting

## API Endpoints

### Health Check
- `GET /health` - Service health status

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `GET /api/products/:id/stock` - Check product stock

### Cart Operations
- `GET /api/users/:userId` - Get user's cart
- `POST /api/users/:userId` - Create or get cart
- `POST /api/users/:userId/items` - Add item to cart
- `DELETE /api/users/:userId/items/:productId` - Remove item from cart
- `PUT /api/users/:userId/items/:productId` - Update item quantity
- `GET /api/users/:userId/items` - Get cart items
- `DELETE /api/users/:userId` - Clear cart
- `GET /api/users/:userId/summary` - Get cart summary

### Orders (Checkout)
- `POST /api/orders/:userId` - Create order (checkout)
- `GET /api/orders/:orderId` - Get order by ID
- `GET /api/orders/user/:userId` - Get orders by user
- `PUT /api/orders/:orderId/status` - Update order status
- `GET /api/orders/:orderId/summary` - Get order summary
- `GET /api/orders/stats` - Get order statistics

## Getting Started

### Prerequisites

- Node.js 16.0.0 or higher
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cart-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Start the production server**
   ```bash
   npm start
   ```

The server will start on `http://localhost:3001` by default.

## Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## API Usage Examples

### Get All Products
```bash
curl http://localhost:3001/api/products
```

### Add Item to Cart
```bash
curl -X POST http://localhost:3001/api/users/user123/items \
  -H "Content-Type: application/json" \
  -d '{
    "productId": 1,
    "quantity": 2
  }'
```

### Get Cart
```bash
curl http://localhost:3001/api/users/user123
```

### Checkout (Create Order)
```bash
curl -X POST http://localhost:3001/api/orders/user123 \
  -H "Content-Type: application/json" \
  -d '{
    "shippingAddress": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "country": "USA"
    },
    "billingAddress": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "country": "USA"
    }
  }'
```

## Data Models

### Product
```json
{
  "id": 1,
  "name": "Premium Wireless Headphones",
  "description": "High-quality wireless headphones...",
  "price": 299.99,
  "category": "Electronics",
  "inStock": true,
  "imageUrl": "https://example.com/image.jpg"
}
```

### Cart Item
```json
{
  "product": { /* Product object */ },
  "quantity": 2,
  "subtotal": 599.98
}
```

### Cart
```json
{
  "id": "cart-uuid",
  "userId": "user123",
  "items": [ /* CartItem array */ ],
  "totalAmount": 599.98,
  "itemCount": 2,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Order
```json
{
  "id": "order-uuid",
  "userId": "user123",
  "items": [ /* CartItem array */ ],
  "totalAmount": 599.98,
  "itemCount": 2,
  "shippingAddress": { /* Address object */ },
  "billingAddress": { /* Address object */ },
  "status": "pending",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

## Error Handling

All API responses follow this format:

### Success Response
```json
{
  "success": true,
  "data": { /* Response data */ },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": [ /* Validation errors if any */ ]
}
```

## Testing

Run tests using Jest:

```bash
npm test
```

## Development

### Project Structure
```
src/
├── models/          # Data models
├── services/        # Business logic
├── routes/          # API routes
├── middleware/      # Custom middleware
├── utils/           # Utility functions
└── server.js        # Main server file
```

### Adding New Features

1. **Models**: Add new data models in `src/models/`
2. **Services**: Implement business logic in `src/services/`
3. **Routes**: Create API routes in `src/routes/`
4. **Middleware**: Add custom middleware in `src/middleware/`

## Security Features

- **CORS**: Configured for frontend integration
- **Helmet**: Security headers
- **Rate Limiting**: Prevents abuse
- **Input Validation**: Joi schema validation
- **Error Handling**: No sensitive data exposure

## Performance Features

- **Compression**: Gzip compression for responses
- **Efficient Data Structures**: In-memory storage for fast access
- **Request Logging**: Morgan for monitoring
- **Graceful Shutdown**: Proper cleanup on termination

## Future Enhancements

- Database integration (PostgreSQL, MongoDB)
- Redis caching
- Authentication and authorization
- Email notifications
- Payment integration
- Order tracking
- Admin dashboard
- API documentation (Swagger)
- Unit and integration tests
- Docker containerization
- CI/CD pipeline

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details
