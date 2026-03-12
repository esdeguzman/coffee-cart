// Test script to verify authentication behavior
// Run this with: node test-auth.js

const http = require('http');

const testAuth = () => {
  console.log('Testing authentication endpoints...\n');
  
  // Test 1: Access protected coffees endpoint without token
  const options1 = {
    hostname: 'localhost',
    port: 4170,
    path: '/coffees',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };
  
  const req1 = http.request(options1, (res) => {
    console.log(`Test 1 - GET /coffees without token:`);
    console.log(`Status: ${res.statusCode}`);
    console.log(`Expected: 401`);
    console.log(`Pass: ${res.statusCode === 401 ? 'YES' : 'NO'}\n`);
  });
  
  req1.on('error', (err) => {
    console.log('Test 1 failed:', err.message);
  });
  
  req1.end();
  
  // Test 2: Access protected coffees endpoint with testing bypass
  const options2 = {
    hostname: 'localhost',
    port: 4170,
    path: '/coffees?bypassAuth=true',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };
  
  const req2 = http.request(options2, (res) => {
    console.log(`Test 2 - GET /coffees with bypassAuth=true:`);
    console.log(`Status: ${res.statusCode}`);
    console.log(`Expected: 200`);
    console.log(`Pass: ${res.statusCode === 200 ? 'YES' : 'NO'}\n`);
  });
  
  req2.on('error', (err) => {
    console.log('Test 2 failed:', err.message);
  });
  
  req2.end();
  
  // Test 3: Access protected cart endpoint without token
  const options3 = {
    hostname: 'localhost',
    port: 4170,
    path: '/api/cart',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };
  
  const req3 = http.request(options3, (res) => {
    console.log(`Test 3 - GET /api/cart without token:`);
    console.log(`Status: ${res.statusCode}`);
    console.log(`Expected: 401`);
    console.log(`Pass: ${res.statusCode === 401 ? 'YES' : 'NO'}\n`);
  });
  
  req3.on('error', (err) => {
    console.log('Test 3 failed:', err.message);
  });
  
  req3.end();
  
  // Test 4: Access update-user endpoint without token
  const options4 = {
    hostname: 'localhost',
    port: 4170,
    path: '/update-user/user',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  };
  
  const req4 = http.request(options4, (res) => {
    console.log(`Test 4 - POST /update-user/user without token:`);
    console.log(`Status: ${res.statusCode}`);
    console.log(`Expected: 401`);
    console.log(`Pass: ${res.statusCode === 401 ? 'YES' : 'NO'}\n`);
  });
  
  req4.on('error', (err) => {
    console.log('Test 4 failed:', err.message);
  });
  
  req4.end();
};

// Check if auth server is running first
const checkServer = () => {
  const options = {
    hostname: 'localhost',
    port: 4170,
    path: '/',
    method: 'GET'
  };
  
  const req = http.request(options, (res) => {
    console.log('Auth server is running. Starting tests...\n');
    testAuth();
  });
  
  req.on('error', (err) => {
    console.log('Error: Auth server is not running on port 4170');
    console.log('Please start the auth server first: npm run auth-server');
  });
  
  req.end();
};

checkServer();
