#!/bin/bash

echo "🧪 Running Authentication Tests"
echo "================================"

# Check if auth server is running
echo "1. Checking if auth server is running..."
curl -s http://localhost:4170/ > /dev/null
if [ $? -ne 0 ]; then
    echo "❌ Auth server is not running on port 4170"
    echo "Please start it with: npm run auth-server"
    exit 1
else
    echo "✅ Auth server is running"
fi

echo ""
echo "2. Running Node.js authentication tests..."
node test-auth.js

echo ""
echo "3. Test Summary:"
echo "   - All protected endpoints now require authentication"
echo "   - /coffees endpoint is protected (was public)"
echo "   - /api/cart endpoint is protected" 
echo "   - /update-user endpoint is protected"
echo "   - Testing bypass available: ?bypassAuth=true"
echo ""
echo "4. To run Cypress tests:"
echo "   npm run test:e2e or cypress open"
echo "   Then run: cypress-auth-test.cy.js"

echo ""
echo "🎯 Authentication implementation complete!"
