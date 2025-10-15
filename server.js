const express = require('express');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');
require('dotenv').config();

// Import database configuration
const connectDB = require('./config/db');

// Import route modules
const userRoutes = require('./routes/users');
const adminRoutes = require('./routes/admin');
const flightRoutes = require('./routes/flights');
const hotelRoutes = require('./routes/hotels');
const bookingRoutes = require('./routes/bookings');
const healthRoutes = require('./routes/health');

const app = express();
const PORT = process.env.PORT || 4000;

// Connect to MongoDB
connectDB();

//
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:4000',
    credentials: true
}));



// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key-here-change-in-production',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/travelEas',
        touchAfter: 24 * 3600 // lazy session update
    }),
    cookie: {
        secure: false, // Force HTTP-only cookies
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
    }
}));

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public directory with proper configuration
app.use(express.static(path.join(__dirname, 'public'), {
    // Set proper MIME types
    setHeaders: (res, path, stat) => {
        // Handle CSS files
        if (path.endsWith('.css')) {
            res.set('Content-Type', 'text/css');
        }
        // Handle JS files
        if (path.endsWith('.js')) {
            res.set('Content-Type', 'application/javascript');
        }
        // Handle image files
        if (path.endsWith('.webp')) {
            res.set('Content-Type', 'image/webp');
        }
        if (path.endsWith('.jpg') || path.endsWith('.jpeg')) {
            res.set('Content-Type', 'image/jpeg');
        }
        if (path.endsWith('.png')) {
            res.set('Content-Type', 'image/png');
        }
        // Enable caching for static assets
        res.set('Cache-Control', 'public, max-age=31536000');
    },
    // Disable directory browsing
    index: false,
    // Enable case-insensitive file matching for better Linux compatibility
    caseSensitive: false
}));

// API Routes with proper error handling and logging
app.use('/api/health', healthRoutes); // Health check routes (no auth required)
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/flights', (req, res, next) => {
    console.log(`📡 Flight API request: ${req.method} ${req.url}`);
    console.log('   Body:', JSON.stringify(req.body));
    console.log('   Platform:', process.platform);
    next();
}, flightRoutes);
app.use('/api/hotels', (req, res, next) => {
    console.log(`🏨 Hotel API request: ${req.method} ${req.url}`);
    console.log('   Body:', JSON.stringify(req.body));
    console.log('   Platform:', process.platform);
    next();
}, hotelRoutes);
app.use('/api/bookings', bookingRoutes);

// Add search history routes
const searchHistoryRoutes = require('./routes/searchHistory');
app.use('/api/search-history', searchHistoryRoutes);

// Add dashboard routes
const dashboardRoutes = require('./routes/dashboard');
app.use('/api/dashboard', dashboardRoutes);

// Backwards compatibility for old API endpoints
app.post('/api/register', (req, res) => res.redirect(307, '/api/users/register'));
app.post('/api/login', (req, res) => res.redirect(307, '/api/users/login'));
app.post('/api/logout', (req, res) => res.redirect(307, '/api/users/logout'));
app.get('/api/user', (req, res) => res.redirect(307, '/api/users/current'));
app.put('/api/user/profile', (req, res) => res.redirect(307, '/api/users/profile'));

// HTML Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'index.html'));
});

// Dashboard route
app.get('/dashboard-pages/dashboard.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'dashboard.html'));
});

// Additional routes for HTML files in public/html folder
app.get('/html/:filename', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', req.params.filename));
});

// Routes for direct HTML file access
app.get('/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'index.html'));
});

app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'login.html'));
});

app.get('/register.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'register.html'));
});

app.get('/dashboard.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'dashboard.html'));
});

app.get('/flights.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'flights.html'));
});

app.get('/hotels.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'hotels.html'));
});

app.get('/packages.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'packages.html'));
});

app.get('/offers.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'offers.html'));
});

app.get('/profile.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'profile.html'));
});

app.get('/wallet.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'wallet.html'));
});

app.get('/users.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'users.html'));
});

// Admin HTML routes
app.get('/admin/:filename', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'admin', req.params.filename));
});

// Routes for dashboard pages (legacy support)
app.get('/dashboard-pages/:filename', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', req.params.filename));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ 
        success: false, 
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ 
        success: false, 
        message: 'Route not found',
        path: req.originalUrl
    });
});

app.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════════════════════════╗
║                    TRAVEL EASE SERVER                    ║
║                                                          ║
║  🌍 Server running on: http://localhost:${PORT}           ║
║  📁 Serving files from: public/                         ║
║  🗄️  Database: MongoDB                                   ║
║  🔐 Session store: MongoDB                               ║
║                                                          ║
║  📂 Project Structure:                                   ║
║     ├── routes/     (API route definitions)             ║
║     ├── controllers/ (Business logic)                   ║
║     ├── models/     (Database schemas)                  ║
║     ├── utils/      (Helper functions)                  ║
║     ├── config/     (Configuration files)              ║
║     └── public/     (Static assets)                     ║
║                                                          ║
║  🚀 Ready for development!                               ║
╚══════════════════════════════════════════════════════════╝
    `);
});
