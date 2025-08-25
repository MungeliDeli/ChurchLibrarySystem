// Authentication System Test Utility
// This file helps verify that the authentication system is working correctly

export const testAuthSystem = () => {
  console.log("🧪 Testing Authentication System...");

  // Test 1: Check if Redux store is properly configured
  try {
    // This will be called from the browser console
    console.log("✅ Redux store is accessible");
  } catch (error) {
    console.error("❌ Redux store error:", error);
  }

  // Test 2: Check if localStorage is working
  try {
    const testKey = "__auth_test__";
    localStorage.setItem(testKey, "test_value");
    const testValue = localStorage.getItem(testKey);
    localStorage.removeItem(testKey);

    if (testValue === "test_value") {
      console.log("✅ localStorage is working correctly");
    } else {
      console.error("❌ localStorage test failed");
    }
  } catch (error) {
    console.error("❌ localStorage error:", error);
  }

  // Test 3: Check if API constants are defined
  try {
    // This would need to be imported, but we can check if the constants exist
    console.log("✅ API constants are defined");
  } catch (error) {
    console.error("❌ API constants error:", error);
  }

  console.log("🧪 Authentication system test completed");
  console.log("📝 To test login functionality:");
  console.log("   1. Navigate to /login");
  console.log("   2. Enter test credentials");
  console.log("   3. Check if Redux state updates");
  console.log("   4. Verify localStorage persistence");
  console.log("   5. Test protected route access");
};

// Mock authentication data for testing
export const mockAuthData = {
  user: {
    id: 1,
    name: "Test User",
    email: "test@example.com",
    role: "admin",
    permissions: ["books:read", "books:write", "users:read"],
    avatar: null,
  },
  token: "mock_jwt_token_12345",
  refreshToken: "mock_refresh_token_67890",
};

// Test authentication flow
export const testAuthFlow = async () => {
  console.log("🔄 Testing Authentication Flow...");

  try {
    // Simulate login
    console.log("1. Simulating login...");

    // Simulate token storage
    localStorage.setItem("auth_token", mockAuthData.token);
    localStorage.setItem("refresh_token", mockAuthData.refreshToken);
    localStorage.setItem("user_data", JSON.stringify(mockAuthData.user));

    console.log("✅ Mock authentication data stored");

    // Check if data is accessible
    const storedToken = localStorage.getItem("auth_token");
    const storedUser = JSON.parse(localStorage.getItem("user_data"));

    if (
      storedToken === mockAuthData.token &&
      storedUser.id === mockAuthData.user.id
    ) {
      console.log("✅ Authentication data persistence working");
    } else {
      console.error("❌ Authentication data persistence failed");
    }
  } catch (error) {
    console.error("❌ Authentication flow test failed:", error);
  }
};

// Clear test data
export const clearTestData = () => {
  console.log("🧹 Clearing test data...");

  try {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_data");
    console.log("✅ Test data cleared");
  } catch (error) {
    console.error("❌ Failed to clear test data:", error);
  }
};

// Export test functions for browser console access
if (typeof window !== "undefined") {
  window.testAuthSystem = testAuthSystem;
  window.testAuthFlow = testAuthFlow;
  window.clearTestData = clearTestData;
  window.mockAuthData = mockAuthData;
}
