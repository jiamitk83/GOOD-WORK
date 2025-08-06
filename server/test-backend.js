require('dotenv').config();
const connectDB = require('./config/db');

async function testBackend() {
  try {
    console.log('🧪 Testing backend setup...');
    
    // Test database connection
    await connectDB();
    console.log('✅ Database connection successful');
    
    // Test basic server setup
    const express = require('express');
    const app = express();
    
    app.get('/test', (req, res) => {
      res.json({ message: 'Backend test successful!' });
    });
    
    const server = app.listen(5001, () => {
      console.log('✅ Express server test successful on port 5001');
      server.close();
      process.exit(0);
    });
    
  } catch (error) {
    console.error('❌ Backend test failed:', error.message);
    process.exit(1);
  }
}

testBackend();
