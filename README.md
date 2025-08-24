# 🌿 Urvann Plant Store - Backend API

A robust REST API for the Plant Store application built with Node.js, Express, and MongoDB. Provides endpoints for plant management, user wishlists, and shopping cart functionality.

## 🚀 Live API

- **Base URL:** [https://your-backend.up.railway.app](https://your-backend.up.railway.app)
- **Health Check:** [https://your-backend.up.railway.app/api/health](https://your-backend.up.railway.app/api/health)
- **API Documentation:** Available via endpoints below

## ✨ Features

- 🌱 **Plant Management** - CRUD operations for plant inventory
- ❤️ **Wishlist System** - User-specific wishlist management
- 🛒 **Shopping Cart** - Cart management with quantities and totals
- 🔐 **Security** - Rate limiting, CORS, and input validation
- 📊 **Database** - MongoDB with Mongoose ODM
- 🚀 **Performance** - Optimized queries with indexing
- 📝 **Validation** - Comprehensive input validation and error handling
- 🔄 **Real-time** - WebSocket-ready architecture

## 🛠️ Tech Stack

- **Runtime:** Node.js (v18+)
- **Framework:** Express.js
- **Database:** MongoDB Atlas
- **ODM:** Mongoose
- **Authentication:** JWT Ready (extensible)
- **Security:** Helmet, CORS, Rate Limiting
- **Validation:** Mongoose Validation + Custom Validators
- **Deployment:** Railway

## 📋 Prerequisites

Before you begin, ensure you have:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Git](https://git-scm.com/)

## 🚀 Getting Started

### 1. Clone the Repository

git clone https://github.com/yourusername/plant-store-backend.git
cd plant-store-backend

text

### 2. Install Dependencies

npm install

text

### 3. Environment Variables

Create a `.env` file in the root directory:

Server Configuration
NODE_ENV=development
PORT=5000

Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/plantstore?retryWrites=true&w=majority

Frontend URLs (for CORS)
FRONTEND_URL=http://localhost:5173

Security (Optional)
JWT_SECRET=your-jwt-secret-key

text

### 4. Setup Database

Create database collections and indexes
npm run setup-db

Seed with sample data
npm run seed

text

### 5. Start Development Server

npm run dev

text

The API will be available at `http://localhost:5000`

## 📜 Available Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start production server |
| `npm run dev` | Start development server with nodemon |
| `npm run setup-db` | Initialize database collections and indexes |
| `npm run seed` | Populate database with sample data |
| `npm test` | Run test suite (when implemented) |

## 🏗️ Project Structure

backend/
├── config/
│ └── database.js # MongoDB connection
├── models/
│ ├── Plant.js # Plant schema
│ ├── Wishlist.js # Wishlist schema
│ └── Cart.js # Cart schema
├── routes/
│ ├── plants.js # Plant CRUD endpoints
│ ├── wishlist.js # Wishlist endpoints
│ └── cart.js # Cart endpoints
├── seeders/
│ └── plantSeeder.js # Database seeder
├── scripts/
│ └── setupDatabase.js # Database setup script
├── .env.example # Environment variables template
├── server.js # Main application file
└── package.json

text

## 🛣️ API Endpoints

### Health Check
GET /api/health

text

### Plants
GET /api/plants # Get all plants (with query filters)
GET /api/plants/:id # Get plant by ID
POST /api/plants # Create new plant
PUT /api/plants/:id # Update plant
DELETE /api/plants/:id # Delete plant

text

### Wishlist
GET /api/wishlist/:userId # Get user's wishlist
POST /api/wishlist/:userId # Add plant to wishlist
DELETE /api/wishlist/:userId/:plantId # Remove from wishlist

text

### Cart
GET /api/cart/:userId # Get user's cart
POST /api/cart/:userId # Add item to cart
PUT /api/cart/:userId/:plantId # Update cart item quantity
DELETE /api/cart/:userId/:plantId # Remove item from cart
DELETE /api/cart/:userId # Clear entire cart

text

## 📊 Database Schema

### Plant Model
{
name: String, // Plant name
price: Number, // Price in currency
categories: [String], // Plant categories
isAvailable: Boolean, // Stock status
description: String, // Plant description
scientificName: String, // Scientific name
image: String, // Image URL
lightRequirement: String, // Light needs
wateringFrequency: String, // Watering schedule
potSize: String, // Pot size
careInstructions: String, // Care guide
popularity: Number, // Popularity score
createdAt: Date, // Creation timestamp
updatedAt: Date // Last update
}

text

### Wishlist Model
{
userId: String, // User identifier
plants: [{
plantId: ObjectId, // Reference to Plant
notes: String, // User notes
addedAt: Date // Date added
}],
createdAt: Date,
updatedAt: Date
}

text

### Cart Model
{
userId: String, // User identifier
items: [{
plantId: ObjectId, // Reference to Plant
quantity: Number, // Item quantity
price: Number, // Price at time of addition
addedAt: Date // Date added
}],
totalAmount: Number, // Total cart value
totalItems: Number, // Total item count
createdAt: Date,
updatedAt: Date
}

text

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NODE_ENV` | Environment mode | No | `development` |
| `PORT` | Server port | No | `5000` |
| `MONGODB_URI` | MongoDB connection string | Yes | - |
| `FRONTEND_URL` | Frontend URL for CORS | No | `http://localhost:5173` |
| `JWT_SECRET` | JWT signing secret | No | - |

### Database Connection Options

{
dbName: 'plantstore',
serverSelectionTimeoutMS: 30000,
socketTimeoutMS: 45000,
family: 4
}

text

### Security Configuration

- **Rate Limiting:** 200 requests per 15 minutes (production)
- **CORS:** Configured for frontend domains
- **Helmet:** Security headers enabled
- **Input Validation:** Mongoose validation + custom validators

## 🚢 Deployment

### Railway (Recommended)

1. **Connect repository to Railway**
2. **Set environment variables:**
NODE_ENV=production
MONGODB_URI=your_atlas_connection_string
FRONTEND_URL=https://your-frontend.vercel.app

text
3. **Deploy automatically on push to main**

### Manual Deployment

Build dependencies
npm install --production

Start server
npm start

text

## 🧪 API Testing

### Using cURL

Health check
curl https://your-api.railway.app/api/health

Get all plants
curl https://your-api.railway.app/api/plants

Add to wishlist
curl -X POST https://your-api.railway.app/api/wishlist/user123
-H "Content-Type: application/json"
-d '{"plantId": "plant_id_here", "notes": "Love this plant!"}'

text

### Using Postman

Import the API collection for comprehensive testing (collection file available on request).

## 📈 Performance

- **Database Indexing:** Optimized queries with proper indexes
- **Connection Pooling:** MongoDB connection pooling enabled
- **Query Optimization:** Lean queries for better performance
- **Error Handling:** Comprehensive error handling and logging

## 🔐 Security

- **Input Validation:** All inputs validated and sanitized
- **Rate Limiting:** Prevents API abuse
- **CORS Configuration:** Restricts cross-origin requests
- **Helmet Security:** Security headers for protection
- **MongoDB Injection:** Protected via Mongoose validation

## 🐛 Troubleshooting

### Common Issues

**MongoDB Connection:**
Check connection string format
mongodb+srv://username:password@cluster.mongodb.net/plantstore

Verify IP whitelist in MongoDB Atlas
text

**Port Already in Use:**
Find process using port 5000
lsof -i :5000

Kill the process
kill -9 PID

text

**Environment Variables:**
Verify .env file exists and has correct values
cat .env

text

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/new-endpoint`)
3. Commit changes (`git commit -m 'Add new endpoint'`)
4. Push to branch (`git push origin feature/new-endpoint`)
5. Create Pull Request

### Code Standards

- Use ESLint for code formatting
- Follow RESTful API conventions
- Write descriptive commit messages
- Add proper error handling
- Include input validation

## 📊 Monitoring

### Health Checks

The API provides health check endpoints for monitoring:

GET /api/health # Basic health check
GET /api/test-db # Database connectivity check

text

### Logging

- Request logging via Morgan (development)
- Error logging to console
- Database connection status logging


## 🙏 Acknowledgments

- [Express.js](https://expressjs.com/) for the web framework
- [MongoDB](https://www.mongodb.com/) for the database
- [Mongoose](https://mongoosejs.com/) for elegant MongoDB object modeling
- [Railway](https://railway.app/) for seamless deployment


Built with ❤️ for plant lovers everywhere 🌱
