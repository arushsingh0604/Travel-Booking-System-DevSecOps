// Wallet utility functions
const User = require('../models/User');

// Add money to user wallet
const addMoney = async (userId, amount, description = 'Money added to wallet') => {
    try {
        if (amount <= 0) {
            return { success: false, message: 'Amount must be greater than zero' };
        }
        
        const user = await User.findById(userId);
        if (!user) {
            return { success: false, message: 'User not found' };
        }
        
        user.balance += amount;
        user.updatedAt = new Date();
        await user.save();
        
        return {
            success: true,
            message: 'Money added successfully',
            newBalance: user.balance,
            transaction: {
                type: 'credit',
                amount: amount,
                description: description,
                timestamp: new Date()
            }
        };
    } catch (error) {
        return { success: false, message: 'Error adding money to wallet', error: error.message };
    }
};

// Deduct money from user wallet
const deductMoney = async (userId, amount, description = 'Payment processed') => {
    try {
        if (amount <= 0) {
            return { success: false, message: 'Amount must be greater than zero' };
        }
        
        const user = await User.findById(userId);
        if (!user) {
            return { success: false, message: 'User not found' };
        }
        
        if (user.balance < amount) {
            return { success: false, message: 'Insufficient balance' };
        }
        
        user.balance -= amount;
        user.updatedAt = new Date();
        await user.save();
        
        return {
            success: true,
            message: 'Payment processed successfully',
            newBalance: user.balance,
            transaction: {
                type: 'debit',
                amount: amount,
                description: description,
                timestamp: new Date()
            }
        };
    } catch (error) {
        return { success: false, message: 'Error processing payment', error: error.message };
    }
};

// Check wallet balance
const getBalance = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            return { success: false, message: 'User not found' };
        }
        
        return {
            success: true,
            balance: user.balance
        };
    } catch (error) {
        return { success: false, message: 'Error fetching balance', error: error.message };
    }
};

// Transfer money between users
const transferMoney = async (fromUserId, toUserId, amount, description = 'Money transfer') => {
    try {
        if (amount <= 0) {
            return { success: false, message: 'Amount must be greater than zero' };
        }
        
        const fromUser = await User.findById(fromUserId);
        const toUser = await User.findById(toUserId);
        
        if (!fromUser) {
            return { success: false, message: 'Sender not found' };
        }
        
        if (!toUser) {
            return { success: false, message: 'Recipient not found' };
        }
        
        if (fromUser.balance < amount) {
            return { success: false, message: 'Insufficient balance' };
        }
        
        // Deduct from sender
        fromUser.balance -= amount;
        fromUser.updatedAt = new Date();
        
        // Add to recipient
        toUser.balance += amount;
        toUser.updatedAt = new Date();
        
        await fromUser.save();
        await toUser.save();
        
        return {
            success: true,
            message: 'Transfer completed successfully',
            fromUserBalance: fromUser.balance,
            toUserBalance: toUser.balance,
            transaction: {
                type: 'transfer',
                amount: amount,
                from: fromUserId,
                to: toUserId,
                description: description,
                timestamp: new Date()
            }
        };
    } catch (error) {
        return { success: false, message: 'Error processing transfer', error: error.message };
    }
};

// Format currency
const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency
    }).format(amount);
};

// Validate transaction amount
const validateAmount = (amount) => {
    if (!amount || isNaN(amount)) {
        return { valid: false, message: 'Invalid amount' };
    }
    
    if (amount <= 0) {
        return { valid: false, message: 'Amount must be greater than zero' };
    }
    
    if (amount > 10000) {
        return { valid: false, message: 'Amount cannot exceed $10,000 per transaction' };
    }
    
    return { valid: true, message: 'Amount is valid' };
};

module.exports = {
    addMoney,
    deductMoney,
    getBalance,
    transferMoney,
    formatCurrency,
    validateAmount
};
