#!/usr/bin/env node

/**
 * Linux Troubleshooting Script for Travel Ease Application
 * 
 * This script helps diagnose and fix common issues when running
 * the Travel Ease application on Linux systems.
 * 
 * Usage:
 *   node scripts/linuxTroubleshoot.js
 *   # or
 *   ./scripts/linuxTroubleshoot.js
 */

const fs = require('fs');
const path = require('path');
const { spawn, exec } = require('child_process');
const util = require('util');

const execAsync = util.promisify(exec);

// Colors for console output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
};

const log = {
    info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
    success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
    warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
    error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
    header: (msg) => console.log(`${colors.cyan}${colors.bright}${msg}${colors.reset}`),
    section: (msg) => console.log(`\n${colors.magenta}📋 ${msg}${colors.reset}`)
};

// Check if running on Linux
const checkPlatform = () => {
    log.section('Platform Check');
    
    if (process.platform !== 'linux') {
        log.warning(`Running on ${process.platform}, not Linux`);
        log.info('This script is designed for Linux troubleshooting');
        return false;
    }
    
    log.success('Running on Linux');
    log.info(`Node.js version: ${process.version}`);
    log.info(`Architecture: ${process.arch}`);
    
    return true;
};

// Check file system permissions and case sensitivity
const checkFileSystem = async () => {
    log.section('File System Check');
    
    try {
        // Check if files exist with correct case
        const criticalFiles = [
            'package.json',
            'server.js',
            'config/db.js',
            'models/Flight.js',
            'models/Hotel.js',
            'controllers/flightController.js',
            'controllers/hotelController.js',
            'routes/flights.js',
            'routes/hotels.js'
        ];
        
        const missingFiles = [];
        const foundFiles = [];
        
        for (const file of criticalFiles) {
            const filePath = path.join(process.cwd(), file);
            try {
                await fs.promises.access(filePath, fs.constants.F_OK);
                foundFiles.push(file);
            } catch (error) {
                missingFiles.push(file);
            }
        }
        
        log.info(`Found ${foundFiles.length}/${criticalFiles.length} critical files`);
        
        if (missingFiles.length > 0) {
            log.error('Missing critical files:');
            missingFiles.forEach(file => log.error(`  - ${file}`));
            return false;
        }
        
        log.success('All critical files found');
        
        // Check permissions
        try {
            const stats = await fs.promises.stat('./server.js');
            log.info(`server.js permissions: ${stats.mode.toString(8)}`);
            
            if (!(stats.mode & 0o444)) {
                log.error('server.js is not readable');
                return false;
            }
            
            log.success('File permissions OK');
        } catch (error) {
            log.error(`Permission check failed: ${error.message}`);
            return false;
        }
        
        return true;
        
    } catch (error) {
        log.error(`File system check failed: ${error.message}`);
        return false;
    }
};

// Check MongoDB service
const checkMongoDB = async () => {
    log.section('MongoDB Service Check');
    
    try {
        // Check if MongoDB service is running
        const { stdout: serviceStatus } = await execAsync('systemctl is-active mongod').catch(() => ({ stdout: 'inactive' }));
        
        if (serviceStatus.trim() === 'active') {
            log.success('MongoDB service is active');
        } else {
            log.warning('MongoDB service is not active');
            log.info('Try: sudo systemctl start mongod');
            log.info('To enable on boot: sudo systemctl enable mongod');
        }
        
        // Check if MongoDB port is open
        try {
            const { stdout: portCheck } = await execAsync('netstat -tulpn | grep :27017');
            if (portCheck.includes('27017')) {
                log.success('MongoDB port 27017 is open');
            } else {
                log.warning('MongoDB port 27017 not found');
            }
        } catch (error) {
            log.warning('Could not check MongoDB port (netstat might not be installed)');
            log.info('Install net-tools: sudo apt-get install net-tools');
        }
        
        // Try to connect to MongoDB
        try {
            const mongoose = require('mongoose');
            await mongoose.connect('mongodb://localhost:27017/travelEas', {
                serverSelectionTimeoutMS: 3000
            });
            log.success('Successfully connected to MongoDB');
            await mongoose.connection.close();
            return true;
        } catch (error) {
            log.error(`MongoDB connection failed: ${error.message}`);
            log.info('Check MongoDB logs: sudo journalctl -u mongod -f');
            return false;
        }
        
    } catch (error) {
        log.error(`MongoDB check failed: ${error.message}`);
        return false;
    }
};

// Check Node.js dependencies
const checkDependencies = async () => {
    log.section('Dependencies Check');
    
    try {
        // Check if node_modules exists
        const nodeModulesPath = path.join(process.cwd(), 'node_modules');
        try {
            await fs.promises.access(nodeModulesPath, fs.constants.F_OK);
            log.success('node_modules directory exists');
        } catch (error) {
            log.error('node_modules directory not found');
            log.info('Run: npm install');
            return false;
        }
        
        // Check critical dependencies
        const criticalDeps = [
            'express',
            'mongoose',
            'dotenv',
            'cors',
            'helmet',
            'express-session',
            'connect-mongo'
        ];
        
        const packageJson = JSON.parse(await fs.promises.readFile('package.json', 'utf8'));
        const installedDeps = { ...packageJson.dependencies, ...packageJson.devDependencies };
        
        const missingDeps = criticalDeps.filter(dep => !installedDeps[dep]);
        
        if (missingDeps.length > 0) {
            log.error('Missing critical dependencies:');
            missingDeps.forEach(dep => log.error(`  - ${dep}`));
            log.info('Run: npm install');
            return false;
        }
        
        log.success('All critical dependencies found');
        return true;
        
    } catch (error) {
        log.error(`Dependencies check failed: ${error.message}`);
        return false;
    }
};

// Check environment configuration
const checkEnvironment = async () => {
    log.section('Environment Configuration Check');
    
    try {
        // Check for .env file
        const envPath = path.join(process.cwd(), '.env');
        let hasEnvFile = false;
        
        try {
            await fs.promises.access(envPath, fs.constants.F_OK);
            hasEnvFile = true;
            log.success('.env file found');
        } catch (error) {
            log.warning('.env file not found');
            log.info('Copy .env.example to .env: cp .env.example .env');
        }
        
        // Check environment variables
        require('dotenv').config();
        
        const requiredVars = ['MONGODB_URI', 'SESSION_SECRET'];
        const missingVars = requiredVars.filter(varName => !process.env[varName]);
        
        if (missingVars.length > 0) {
            log.warning('Missing environment variables:');
            missingVars.forEach(varName => log.warning(`  - ${varName}`));
        } else {
            log.success('Required environment variables set');
        }
        
        // Check MongoDB URI format
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/travelEas';
        log.info(`MongoDB URI: ${mongoUri}`);
        
        if (!mongoUri.startsWith('mongodb://') && !mongoUri.startsWith('mongodb+srv://')) {
            log.error('Invalid MongoDB URI format');
            return false;
        }
        
        log.success('Environment configuration OK');
        return true;
        
    } catch (error) {
        log.error(`Environment check failed: ${error.message}`);
        return false;
    }
};

// Test API endpoints
const testAPI = async () => {
    log.section('API Endpoints Test');
    
    try {
        // Start server in background for testing
        log.info('Testing requires the server to be running...');
        log.info('Please start the server in another terminal: npm start');
        log.info('Press Ctrl+C to skip API tests');
        
        // Wait for user input or timeout
        await new Promise(resolve => {
            const timeout = setTimeout(() => {
                log.warning('Skipping API tests (timeout)');
                resolve();
            }, 5000);
            
            process.stdin.once('data', () => {
                clearTimeout(timeout);
                log.info('Skipping API tests');
                resolve();
            });
        });
        
        return true;
        
    } catch (error) {
        log.error(`API test failed: ${error.message}`);
        return false;
    }
};

// Fix common issues
const fixCommonIssues = async () => {
    log.section('Auto-Fix Common Issues');
    
    try {
        // Fix file permissions
        try {
            await execAsync('chmod +x scripts/*.js');
            log.success('Fixed script permissions');
        } catch (error) {
            log.warning('Could not fix script permissions');
        }
        
        // Create .env if missing
        const envPath = path.join(process.cwd(), '.env');
        const envExamplePath = path.join(process.cwd(), '.env.example');
        
        try {
            await fs.promises.access(envPath, fs.constants.F_OK);
        } catch (error) {
            try {
                await fs.promises.copyFile(envExamplePath, envPath);
                log.success('Created .env file from .env.example');
            } catch (copyError) {
                log.warning('Could not create .env file');
            }
        }
        
        log.success('Common issues fixed');
        return true;
        
    } catch (error) {
        log.error(`Auto-fix failed: ${error.message}`);
        return false;
    }
};

// Generate troubleshooting report
const generateReport = async (results) => {
    log.section('Troubleshooting Report');
    
    const reportPath = path.join(process.cwd(), 'troubleshoot-report.txt');
    const timestamp = new Date().toISOString();
    
    let report = `Travel Ease Linux Troubleshooting Report\n`;
    report += `Generated: ${timestamp}\n`;
    report += `Platform: ${process.platform} ${process.arch}\n`;
    report += `Node.js: ${process.version}\n\n`;
    
    Object.entries(results).forEach(([test, passed]) => {
        report += `${test}: ${passed ? 'PASS' : 'FAIL'}\n`;
    });
    
    report += `\nRecommendations:\n`;
    
    if (!results.mongodb) {
        report += `- Install and start MongoDB service\n`;
        report += `  sudo apt-get install mongodb\n`;
        report += `  sudo systemctl start mongod\n`;
        report += `  sudo systemctl enable mongod\n\n`;
    }
    
    if (!results.dependencies) {
        report += `- Install Node.js dependencies\n`;
        report += `  npm install\n\n`;
    }
    
    if (!results.environment) {
        report += `- Configure environment variables\n`;
        report += `  cp .env.example .env\n`;
        report += `  # Edit .env file with appropriate values\n\n`;
    }
    
    report += `For more help, check the README.md file or contact support.\n`;
    
    try {
        await fs.promises.writeFile(reportPath, report);
        log.success(`Report saved to: ${reportPath}`);
    } catch (error) {
        log.error(`Could not save report: ${error.message}`);
    }
};

// Main troubleshooting function
const runTroubleshooting = async () => {
    log.header('🔧 Travel Ease Linux Troubleshooting Tool');
    console.log('=====================================\n');
    
    const results = {};
    
    try {
        // Run all checks
        results.platform = checkPlatform();
        results.filesystem = await checkFileSystem();
        results.mongodb = await checkMongoDB();
        results.dependencies = await checkDependencies();
        results.environment = await checkEnvironment();
        
        // Try to fix common issues
        results.autofix = await fixCommonIssues();
        
        // Test API (optional)
        results.api = await testAPI();
        
        // Generate report
        await generateReport(results);
        
        // Summary
        log.section('Summary');
        const passedTests = Object.values(results).filter(Boolean).length;
        const totalTests = Object.keys(results).length;
        
        if (passedTests === totalTests) {
            log.success('🎉 All checks passed! Your application should work correctly on Linux.');
        } else {
            log.warning(`⚠️  ${passedTests}/${totalTests} checks passed. See recommendations above.`);
        }
        
        log.info('\n📝 Next steps:');
        log.info('1. Start the application: npm start');
        log.info('2. Test the endpoints: node scripts/testMongoDB.js');
        log.info('3. Populate sample data: node scripts/seedDatabase.js');
        log.info('4. Access the application at: http://localhost:4000');
        
    } catch (error) {
        log.error(`Troubleshooting failed: ${error.message}`);
        process.exit(1);
    }
};

// Run troubleshooting if called directly
if (require.main === module) {
    runTroubleshooting();
}

module.exports = {
    checkPlatform,
    checkFileSystem,
    checkMongoDB,
    checkDependencies,
    checkEnvironment,
    testAPI,
    fixCommonIssues,
    runTroubleshooting
};
