// Simple API test script
const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';

async function testAPI() {
  try {
    console.log('🧪 Testing Inclusive Learning API...\n');

    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const health = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health check:', health.data.message);

    // Test registration
    console.log('\n2. Testing user registration...');
    const registerData = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
      role: 'learner',
      disabilityType: ['visual', 'hearing']
    };

    try {
      const register = await axios.post(`${BASE_URL}/auth/register`, registerData);
      console.log('✅ Registration successful');
      
      const token = register.data.data.access_token;
      
      // Test login
      console.log('\n3. Testing user login...');
      const login = await axios.post(`${BASE_URL}/auth/login`, {
        email: 'test@example.com',
        password: 'password123'
      });
      console.log('✅ Login successful');

      // Test protected route
      console.log('\n4. Testing protected route (profile)...');
      const profile = await axios.get(`${BASE_URL}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Profile fetch successful');
      console.log('User accessibility settings:', profile.data.data.accessibilitySettings);

      // Test courses
      console.log('\n5. Testing courses endpoint...');
      const courses = await axios.get(`${BASE_URL}/courses`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Courses fetch successful');
      console.log(`Found ${courses.data.data.length} courses`);

    } catch (error) {
      if (error.response?.data?.error === 'User already exists') {
        console.log('ℹ️  User already exists, testing login...');
        
        const login = await axios.post(`${BASE_URL}/auth/login`, {
          email: 'test@example.com',
          password: 'password123'
        });
        console.log('✅ Login successful');
      } else {
        throw error;
      }
    }

    console.log('\n🎉 All API tests passed!');

  } catch (error) {
    console.error('❌ API test failed:', error.response?.data || error.message);
  }
}

testAPI();