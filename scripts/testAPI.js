const axios = require("axios")

const API_BASE = "http://localhost:5000/api"

// Test API endpoints
const testAPI = async () => {
  try {
    console.log("🧪 Testing FixIt API endpoints...\n")

    // Test health check
    console.log("1. Testing health check...")
    const health = await axios.get(`${API_BASE}/health`)
    console.log("✅ Health check:", health.data.message)

    // Test user registration
    console.log("\n2. Testing user registration...")
    const registerData = {
      name: "Test User",
      email: "test@example.com",
      password: "password123",
      phone: "+1234567890",
      userType: "customer",
      address: {
        street: "123 Test St",
        city: "Test City",
        state: "TS",
        zipCode: "12345",
      },
    }

    try {
      const register = await axios.post(`${API_BASE}/auth/register`, registerData)
      console.log("✅ Registration successful:", register.data.message)

      // Test login
      console.log("\n3. Testing user login...")
      const login = await axios.post(`${API_BASE}/auth/login`, {
        email: "test@example.com",
        password: "password123",
      })
      console.log("✅ Login successful:", login.data.message)

      const token = login.data.token

      // Test protected route
      console.log("\n4. Testing protected route...")
      const profile = await axios.get(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      console.log("✅ Profile fetch successful:", profile.data.user.name)
    } catch (error) {
      if (error.response?.data?.message === "User already exists with this email") {
        console.log("ℹ️ User already exists, testing login...")

        const login = await axios.post(`${API_BASE}/auth/login`, {
          email: "test@example.com",
          password: "password123",
        })
        console.log("✅ Login successful:", login.data.message)
      } else {
        throw error
      }
    }

    // Test workers endpoint
    console.log("\n5. Testing workers search...")
    const workers = await axios.get(`${API_BASE}/workers`)
    console.log(`✅ Found ${workers.data.workers.length} workers`)

    // Test workers with filters
    console.log("\n6. Testing workers search with filters...")
    const filteredWorkers = await axios.get(`${API_BASE}/workers?service=electrician&city=New York`)
    console.log(`✅ Found ${filteredWorkers.data.workers.length} electricians in New York`)

    // Test specific worker
    if (workers.data.workers.length > 0) {
      console.log("\n7. Testing specific worker fetch...")
      const workerId = workers.data.workers[0]._id
      const worker = await axios.get(`${API_BASE}/workers/${workerId}`)
      console.log("✅ Worker details:", worker.data.worker.userId.name)
    }

    console.log("\n🎉 All API tests passed!")
  } catch (error) {
    console.error("❌ API test failed:", error.response?.data || error.message)
  }
}

// Run the tests
testAPI()
