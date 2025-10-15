const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Authentication middleware
const requireAuth = (req, res, next) => {
    if (req.session && req.session.userId) {
        return next();
    }
    return res.status(401).json({ success: false, message: 'Authentication required' });
};

// Register user
const register = async (req, res) => {
    try {
        const { name, email, password, balance, avatar } = req.body;
        
        // Input validation
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
        }
        
        if (password.length < 6) {
            return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ success: false, message: 'Please enter a valid email address' });
        }
        
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email already registered' });
        }
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);
        
        const newUser = new User({ 
            name: name.trim(), 
            email: email.toLowerCase().trim(), 
            password: hashedPassword, 
            balance: balance || 0, 
            avatar: avatar || '../assets/images/img1.png'
        });
        
        await newUser.save();
        
        // Create session
        req.session.userId = newUser._id;
        req.session.user = {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            avatar: newUser.avatar,
            balance: newUser.balance
        };
        
        res.json({ 
            success: true,
            message: 'Registration successful',
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                avatar: newUser.avatar,
                balance: newUser.balance
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ success: false, message: 'Registration failed', error: error.message });
    }
};

// Login user
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required' });
        }
        
        const user = await User.findOne({ email: email.toLowerCase().trim() });
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        
        // Check if user is restricted
        if (user.isRestricted) {
            return res.status(403).json({ success: false, message: 'Account has been restricted. Please contact support.' });
        }
        
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        
        // Create session
        req.session.userId = user._id;
        req.session.user = {
            id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            balance: user.balance
        };
        
        // Update last login
        user.updatedAt = new Date();
        await user.save();
        
        res.json({ 
            success: true,
            message: 'Login successful',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                balance: user.balance
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Login failed', error: error.message });
    }
};

// Logout user
const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Logout failed' });
        }
        res.clearCookie('connect.sid');
        res.json({ success: true, message: 'Logout successful' });
    });
};

// Get current user
const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.session.userId).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching user data', error: error.message });
    }
};

// Update user profile
const updateProfile = async (req, res) => {
    try {
        const { name, avatar } = req.body;
        const updateData = {};
        
        if (name) updateData.name = name.trim();
        if (avatar) updateData.avatar = avatar;
        updateData.updatedAt = new Date();
        
        const updatedUser = await User.findByIdAndUpdate(
            req.session.userId,
            updateData,
            { new: true }
        ).select('-password');
        
        if (!updatedUser) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        
        // Update session
        req.session.user = {
            id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            avatar: updatedUser.avatar,
            balance: updatedUser.balance
        };
        
        res.json({ success: true, message: 'Profile updated successfully', user: updatedUser });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating profile', error: error.message });
    }
};

module.exports = {
    requireAuth,
    register,
    login,
    logout,
    getCurrentUser,
    updateProfile
};
