const express = require("express");
const Bid = require("../mongoDB/models/bidSchema");
const authMiddleware = require("../mongoDB/middleware/verifyUser");
const SellerProfile = require("../mongoDB/models/sellerSchema");
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

router.post("/bids", authMiddleware, csrfProtection, async (req, res) => {
  try {
    const { seller, amount, message } = req.body;

    if (!seller || !amount || !message) {
      return res.status(400).json({
        success: false,
        message: "Seller, amount and message are required"
      });
    }

    const bid = new Bid({
      seller,
      client: req.user.id,
      amount,
      message
    });

    await bid.save();

    // SOCKET EMIT
    const io = req.app.get("io");
    io.to(seller.toString()).emit("new-bid", {
      bid
    });

    res.status(201).json({
      success: true,
      message: "Bid placed successfully",
      bid
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.get("/bids/seller", authMiddleware, async (req, res) => {
  try {
    const sellerProfile = await SellerProfile.findOne({
      user: req.user.id
    }); 

    if (!sellerProfile) {
      return res.status(404).json({ 
        success: false,
        message: "Seller profile not found" 
      });
    }

    const bids = await Bid.find({ seller: sellerProfile._id })
      .populate("client", "username email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      bids,
      freelancerId: sellerProfile._id
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.patch("/bids/:id/status", authMiddleware, csrfProtection, async (req, res) => {
  try {
    const { status } = req.body;

    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid status" 
      });
    }

    const bid = await Bid.findById(req.params.id);

    if (!bid) {
      return res.status(404).json({ 
        success: false,
        message: "Bid not found" 
      });
    }

    bid.status = status;
    await bid.save();

    // SOCKET EMIT TO CLIENT
    const io = req.app.get("io");
    io.to(bid.client.toString()).emit("bid-status-updated", {
      bidId: bid._id,
      status
    });

    res.json({ 
      success: true, 
      message: `Bid ${status} successfully`,
      bid 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

router.get("/bids/client", authMiddleware, async (req, res) => {
  try {
    // Fetch all bids made by this client
    const bids = await Bid.find({ client: req.user.id })
      .populate("seller", "name role") // Populate seller info
      .sort({ createdAt: -1 });

    res.status(200).json({ 
      success: true, 
      bids 
    });
  } catch (error) {
    console.error("CLIENT BIDS ERROR:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

module.exports = router;
