const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const connectDB = require('./config/database');
const plantRoutes = require('./routes/plants');
const wishlistRoutes = require('./routes/wishlist');
const cartRoutes = require('./routes/cart');

const app = express();

app.set('trust proxy', 1);

// Connect to database
connectDB();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [...(process.env.FRONTEND_URL?.split(',') || []), "https://urvannplantify.vercel.app"]
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));


// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 200 : 100,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  }
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Plant Store API is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes
app.use('/api/plants', plantRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/cart', cartRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong!' : err.message
  });
});

// 404 handler
app.use(/.*/, (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});


// Add debug logging after importing routes
console.log('🔍 Loading routes...');
console.log('Plant routes loaded:', typeof plantRoutes);
console.log('Wishlist routes loaded:', typeof wishlistRoutes);
console.log('Cart routes loaded:', typeof cartRoutes);

// Log when routes are registered
app.use('/api/plants', (req, res, next) => {
  console.log(`🌱 Plants API: ${req.method} ${req.url}`);
  next();
}, plantRoutes);

app.use('/api/wishlist', (req, res, next) => {
  console.log(`❤️ Wishlist API: ${req.method} ${req.url}`);
  next();
}, wishlistRoutes);

app.use('/api/cart', (req, res, next) => {
  console.log(`🛒 Cart API: ${req.method} ${req.url}`);
  next();
}, cartRoutes);
