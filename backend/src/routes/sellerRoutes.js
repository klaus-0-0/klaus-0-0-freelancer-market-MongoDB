const express = require("express");
const SellerProfile = require("../mongoDB/models/sellerSchema");
const authMiddleware = require("../mongoDB/middleware/verifyUser");
const csrf = require("csurf");

const router = express.Router();

// CSRF Protection Middleware
const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    secure: true,
    sameSite: "none"
  }
});

router.post("/seller", authMiddleware, csrfProtection, async (req, res) => {
  try {
    const sellerData = new SellerProfile({
      user: req.user.id,
      ...req.body
    });
    
    await sellerData.save();

    console.log("selle = ", sellerData);
    
    res.status(201).json({
      success: true,
      sellerData
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/sellers", async (req, res) => {
  const sellers = await SellerProfile.find().populate("user", "username email");
  res.json(sellers);
});

router.get("/seller/me", authMiddleware, async (req, res) => {
  try {
    const seller = await SellerProfile.findOne({ user: req.user.id });
    if (!seller) {
      return res.status(404).json({ message: "Seller profile not found" });
    }

    res.status(200).json({ success: true, seller });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
