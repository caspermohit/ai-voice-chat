const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');

try {
  const envContent = fs.readFileSync(envPath, 'utf8');
  console.log('Content of .env file:');
  console.log(envContent);
} catch (error) {
  console.error('Error reading .env file:', error.message);
}
