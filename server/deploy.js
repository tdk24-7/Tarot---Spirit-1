#!/usr/bin/env node

/**
 * Script to deploy the Tarot System backend
 * - Checks dependencies
 * - Creates/updates .env file
 * - Initializes the database
 * - Starts the server
 */

const fs = require('fs');
const { execSync } = require('child_process');
const readline = require('readline');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m'
};

/**
 * Prompt user for input
 * @param {string} question
 * @param {string} defaultValue
 * @returns {Promise<string>}
 */
const prompt = (question, defaultValue) => {
  return new Promise((resolve) => {
    rl.question(
      `${colors.yellow}${question}${defaultValue ? ` (${defaultValue})` : ''}: ${colors.reset}`,
      (answer) => {
        resolve(answer || defaultValue);
      }
    );
  });
};

/**
 * Log message with color
 * @param {string} message
 * @param {string} color
 */
const log = (message, color = colors.reset) => {
  console.log(`${color}${message}${colors.reset}`);
};

/**
 * Check if a command exists
 * @param {string} command
 * @returns {boolean}
 */
const commandExists = (command) => {
  try {
    execSync(`which ${command}`, { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Check if nodejs and npm are installed
 */
const checkDependencies = () => {
  log('Checking dependencies...', colors.blue);
  
  if (!commandExists('node')) {
    log('Node.js is not installed. Please install Node.js and try again.', colors.red);
    process.exit(1);
  }
  
  if (!commandExists('npm')) {
    log('npm is not installed. Please install npm and try again.', colors.red);
    process.exit(1);
  }
  
  log('Dependencies check passed.', colors.green);
};

/**
 * Create or update .env file
 */
const setupEnvFile = async () => {
  log('Setting up environment variables...', colors.blue);
  
  const envPath = path.join(__dirname, '.env');
  let envConfig = {};
  
  // Check if .env file exists
  if (fs.existsSync(envPath)) {
    log('Found existing .env file.', colors.yellow);
    
    // Parse existing .env file
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const [key, value] = line.split('=');
      if (key && value) {
        envConfig[key.trim()] = value.trim();
      }
    });
  }
  
  // Prompt for missing env variables
  const dbHost = await prompt('Database host', envConfig.DB_HOST || 'localhost');
  const dbUser = await prompt('Database user', envConfig.DB_USER || 'root');
  const dbPassword = await prompt('Database password', envConfig.DB_PASSWORD || 'password');
  const dbName = await prompt('Database name', envConfig.DB_NAME || 'tarot_system');
  const dbPort = await prompt('Database port', envConfig.DB_PORT || '3306');
  const jwtSecret = await prompt('JWT secret', envConfig.JWT_SECRET || 'tarot-system-secret-key');
  const jwtExpiresIn = await prompt('JWT expires in', envConfig.JWT_EXPIRES_IN || '7d');
  const port = await prompt('Server port', envConfig.PORT || '5000');
  const nodeEnv = await prompt('Node environment', envConfig.NODE_ENV || 'development');
  const clientUrl = await prompt('Client URL', envConfig.CLIENT_URL || 'http://localhost:3000');
  
  // Create .env content
  const envContent = `DB_HOST=${dbHost}
DB_USER=${dbUser}
DB_PASSWORD=${dbPassword}
DB_NAME=${dbName}
DB_PORT=${dbPort}

JWT_SECRET=${jwtSecret}
JWT_EXPIRES_IN=${jwtExpiresIn}

PORT=${port}
NODE_ENV=${nodeEnv}
CLIENT_URL=${clientUrl}`;
  
  // Write .env file
  fs.writeFileSync(envPath, envContent);
  
  log('.env file created/updated successfully.', colors.green);
};

/**
 * Install dependencies
 */
const installDependencies = () => {
  log('Installing dependencies...', colors.blue);
  
  try {
    execSync('npm install', { stdio: 'inherit' });
    log('Dependencies installed successfully.', colors.green);
  } catch (error) {
    log('Failed to install dependencies.', colors.red);
    process.exit(1);
  }
};

/**
 * Start the server
 */
const startServer = async () => {
  const nodeEnv = process.env.NODE_ENV || 'development';
  const startCommand = nodeEnv === 'production' ? 'npm start' : 'npm run dev';
  
  log(`Starting server in ${nodeEnv} mode...`, colors.blue);
  
  try {
    // Ask if user wants to start the server now
    const shouldStart = await prompt('Start the server now? (y/n)', 'y');
    
    if (shouldStart.toLowerCase() === 'y') {
      log(`Server starting with: ${startCommand}`, colors.blue);
      execSync(startCommand, { stdio: 'inherit' });
    } else {
      log(`To start the server, run: ${startCommand}`, colors.blue);
    }
  } catch (error) {
    log('Failed to start server.', colors.red);
    console.error(error);
    process.exit(1);
  }
};

/**
 * Main function
 */
const main = async () => {
  log('Tarot System Server Deployment', colors.green);
  
  checkDependencies();
  await setupEnvFile();
  installDependencies();
  await startServer();
  
  rl.close();
};

// Run main function
main().catch(error => {
  console.error(error);
  process.exit(1);
});