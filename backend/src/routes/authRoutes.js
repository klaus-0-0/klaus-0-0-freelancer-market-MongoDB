const express = require("express");
const User = require("../mongoDB/models/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const csrf = require("csurf");

const router = express.Router();

// CSRF middleware (cookie based)
const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production"
  }
});

// ✅ CSRF TOKEN ROUTE
router.get("/csrf-token", csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

router.post("/signup", csrfProtection, async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "user already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role
    });

    await newUser.save();

    const token = jwt.sign(
      { id: newUser.id, role: newUser.role },
      process.env.TOKEN, 
      { expiresIn: "5h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 5 * 60 * 60 * 1000
    });

    res.status(201).json({
      success: true,
      userData: {
        userId: newUser.id,
        username: newUser.username,
        email: newUser.email
      },
      token
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post("/login", csrfProtection, async (req, res) => {
  try {
    const { email, password } = req.body;
    const findUser = await User.findOne({ email });
    console.log("ne = ", findUser);

    if (!findUser) {
      return res.status(404).json({ message: 'user not found' });
    }
    const isValid = await bcrypt.compare(password, findUser.password);
    if (!isValid) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: findUser.id, role: findUser.role },
      process.env.TOKEN,
      { expiresIn: "5h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 5 * 60 * 60 * 1000
    });

    res.status(201).json({ success: true, message: "success", userData: { email: findUser.email, name: findUser.username, userId: findUser.id }, token })
  } catch (error) {
    console.error(error);
  }
})

module.exports = router;
