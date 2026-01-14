const express = require("express");
const User = require("../mongoDB/models/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const csrf = require("csurf");

const router = express.Router();

// CSRF middleware MUST be initialized with proper config
const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    secure: true, 
    sameSite: "none" 
  }
});

// CSRF TOKEN ENDPOINT - Must be called before any POST request
router.get("/csrf-token", csrfProtection, (req, res) => {
  try {
    const token = req.csrfToken();
    console.log("CSRF Token generated for:", req.headers.origin);
    res.json({ 
      success: true, 
      csrfToken: token 
    });
  } catch (error) {
    console.error("CSRF Token generation error:", error);
    res.status(500).json({ success: false, message: "CSRF token generation failed" });
  }
});

// SIGNUP WITH CSRF PROTECTION
router.post("/signup", csrfProtection, async (req, res) => {
  try {
    console.log("Signup attempt from:", req.headers.origin);
    console.log("CSRF token verified:", req.headers['x-csrf-token']);

    const { username, email, password, role } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: "All fields are required" 
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ 
        success: false, 
        message: "User already exists" 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: role || "user"
    });

    await newUser.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser.id, role: newUser.role },
      process.env.TOKEN, 
      { expiresIn: "5h" }
    );

    // Set HTTP-only cookie with token
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "none",  
      secure: true,      
      maxAge: 5 * 60 * 60 * 1000, // 5 hours
      path: "/"         
    });

    // Response
    res.status(201).json({
      success: true,
      message: "Signup successful",
      userData: {
        userId: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role
      }
    });

  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error during signup",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
});

//  LOGIN WITH CSRF PROTECTION
router.post("/login", csrfProtection, async (req, res) => {
  try {
    console.log("Login attempt from:", req.headers.origin);
    
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: "Email and password are required" 
      });
    }

    // Find user
    const findUser = await User.findOne({ email });
    if (!findUser) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    // Validate password
    const isValid = await bcrypt.compare(password, findUser.password);
    if (!isValid) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid credentials" 
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: findUser.id, role: findUser.role },
      process.env.TOKEN,
      { expiresIn: "5h" }
    );

    // Set HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "none",  
      secure: true,     
      maxAge: 5 * 60 * 60 * 1000,
      path: "/"
    });

    // Response
    res.status(200).json({ 
      success: true, 
      message: "Login successful", 
      userData: { 
        email: findUser.email, 
        name: findUser.username, 
        userId: findUser.id,
        role: findUser.role
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error during login" 
    });
  }
});

//  LOGOUT
router.post("/logout", csrfProtection, (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "none",
    secure: true,
    path: "/"
  });
  res.json({ success: true, message: "Logged out successfully" });
});

//  VALIDATE SESSION (optional)
router.get("/validate", csrfProtection, (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: "Not authenticated" 
      });
    }

    const decoded = jwt.verify(token, process.env.TOKEN);
    res.json({ 
      success: true, 
      user: decoded 
    });
  } catch (error) {
    res.clearCookie("token");
    res.status(401).json({ 
      success: false, 
      message: "Invalid token" 
    });
  }
});

module.exports = router;
