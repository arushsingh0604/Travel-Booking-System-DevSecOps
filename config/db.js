const mongoose = require('mongoose');

const connectDB = async (retries = 5) => {
    try {
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/travelEas';
        
        // Enhanced MongoDB connection options for newer driver versions
        const connectionOptions = {
            // Ensure consistent behavior across platforms
            serverSelectionTimeoutMS: 10000, // Increased from 5000
            socketTimeoutMS: 45000,
            connectTimeoutMS: 10000,
            family: 4, // Use IPv4, skip trying IPv6
            // Connection pool settings
            maxPoolSize: 10,
            minPoolSize: 2, // Reduced from 5 for Linux
            maxIdleTimeMS: 30000,
            // Retry settings for Linux
            retryWrites: true,
            retryReads: true,
            // Read/Write concerns
            readPreference: 'primary',
            writeConcern: {
                w: 'majority',
                wtimeout: 10000 // Increased timeout
            },
            // Removed deprecated buffer settings for newer MongoDB driver
            // bufferMaxEntries and bufferCommands are no longer supported
            // Auth settings
            authSource: 'admin'
        };
        
        console.log('🔌 Connecting to MongoDB...');
        console.log('   URI:', mongoUri);
        console.log('   Platform:', process.platform);
        console.log('   Node version:', process.version);
        
        const conn = await mongoose.connect(mongoUri, connectionOptions);
        
        console.log('✓ Connected to MongoDB successfully');
        console.log('   Database name:', conn.connection.db.databaseName);
        console.log('   Connection host:', conn.connection.host);
        console.log('   Connection port:', conn.connection.port);
        
        // Test collections access
        try {
            const collections = await conn.connection.db.listCollections().toArray();
            console.log('   Available collections:', collections.map(c => c.name));
        } catch (err) {
            console.warn('   ⚠️ Could not list collections:', err.message);
        }
        
        return conn;
    } catch (error) {
        console.error('✗ MongoDB connection error:', error.message);
        console.error('   Error stack:', error.stack);
        
        // Additional debugging for Linux
        if (process.platform === 'linux') {
            console.error('💡 Linux debugging tips:');
            console.error('   1. Check if MongoDB service is running: sudo systemctl status mongod');
            console.error('   2. Check MongoDB logs: sudo journalctl -u mongod');
            console.error('   3. Verify MongoDB port: netstat -tulpn | grep 27017');
            console.error('   4. Check firewall: sudo ufw status');
        }
        
        process.exit(1);
    }
};

// Monitor MongoDB connection
mongoose.connection.on('connected', () => {
    console.log('MongoDB connected');
});

mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
});

module.exports = connectDB;
