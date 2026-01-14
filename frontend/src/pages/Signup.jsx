import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../config";
import wall from "../assets/SignBI.png";

// Configure axios defaults
axios.defaults.withCredentials = true;
axios.defaults.baseURL = config.apiUrl;

// CSRF token management
let csrfToken = "";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "user"
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch CSRF token on component mount
  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        console.log("Fetching CSRF token...");
        const response = await axios.get("/csrf-token");
        csrfToken = response.data.csrfToken;
        console.log("CSRF token received:", csrfToken ? "✓" : "✗");
        
        // Set as default header for all subsequent requests
        axios.defaults.headers.common['X-CSRF-Token'] = csrfToken;
      } catch (err) {
        console.error("Failed to fetch CSRF token:", err.message);
        setError("Cannot establish secure connection. Please refresh.");
      }
    };

    fetchCsrfToken();
    
    // Check if already logged in
    const userData = localStorage.getItem("userData");
    if (userData) {
      navigate("/Dashboard");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(""); // Clear errors on typing
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.username || !formData.email || !formData.password) {
      setError("All fields are required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      console.log("Attempting signup with CSRF token:", csrfToken ? "Present" : "Missing");
      
      const response = await axios.post("/signup", formData, {
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken
        }
      });

      console.log("Signup response:", response.data);

      if (response.data.success) {
        // Store user data
        localStorage.setItem("userData", JSON.stringify(response.data.userData));
        
        // Optional: Store in sessionStorage for better security
        sessionStorage.setItem("isAuthenticated", "true");
        
        // Navigate to home
        navigate("/Home");
      } else {
        setError(response.data.message || "Signup failed");
      }
    } catch (err) {
      console.error("Signup error details:", {
        status: err.response?.status,
        data: err.response?.data,
        headers: err.response?.headers
      });
      
      if (err.response?.status === 403) {
        setError("Security token expired. Please refresh the page.");
        // Refresh CSRF token
        const refreshResponse = await axios.get("/csrf-token");
        csrfToken = refreshResponse.data.csrfToken;
        axios.defaults.headers.common['X-CSRF-Token'] = csrfToken;
      } else {
        setError(err.response?.data?.message || "Signup failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      <img
        src={wall}
        alt="Background"
        className="absolute w-full h-full object-cover opacity-100"
      />

      <nav className="w-full bg-transparent p-4 flex justify-end relative z-10 border-b-2">
        <div className="flex flex-wrap items-center justify-end gap-2 md:gap-6">
          <button
            className="text-black font-bold text-sm md:text-base"
            onClick={() => navigate("/about")}
          >
            About
          </button>
          <button
            className="bg-black hover:bg-cyan-700 text-white py-1 px-2 md:py-2 md:px-4 rounded font-medium text-sm md:text-base transition cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center lg:justify-start p-4 relative z-10">
        <div className="w-full max-w-md lg:ml-80 bg-white bg-opacity-90 p-6 rounded-lg shadow-lg">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
            <p className="text-gray-600 mt-2">Welcome</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup}>
            <div className="space-y-4">
              <input
                type="text"
                name="username"
                className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
              />

              <input
                type="email"
                name="email"
                className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <input
                type="password"
                name="password"
                className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
              />

              <div className="flex justify-center pt-4 gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-50 bg-black hover:bg-gray-800 text-white py-3 px-6 rounded font-medium transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Creating Account..." : "Sign Up"}
                </button>
                
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="w-50 bg-white hover:bg-gray-100 text-black border border-gray-300 py-3 px-6 rounded font-medium transition cursor-pointer"
                >
                  Log In
                </button>
              </div>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-cyan-600 hover:text-cyan-800 font-medium"
              >
                Sign in here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
