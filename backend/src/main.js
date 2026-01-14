const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { Server } = require("socket.io");
const cookieParser = require("cookie-parser");
const http = require("http");
const csrf = require("csurf");

dotenv.config({ path: "../.env" });

const app = express();
const server = http.createServer(app);

const FRONTEND_URL = "https://klaus-0-0-freelancer-market.onrender.com";
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-CSRF-Token", "X-Requested-With"]
}));

app.use(cookieParser());
app.use(express.json());

const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    secure: true,
    sameSite: "none"
  }
});

// CSRF to all routes except GET
app.use((req, res, next) => {
  if (req.method === "GET") {
    return next(); 
  }
  csrfProtection(req, res, next);
});

app.use("/api", require("../src/routes/authRoutes"));
app.use("/api", require("../src/routes/sellerRoutes"));
app.use("/api", require("../src/routes/bidRoutes"));

// Socket.io
const io = new Server(server, {
  cors: {
    origin: FRONTEND_URL,
    methods: ["GET", "POST", "PATCH", "OPTIONS"],
    credentials: true,
  },
});

app.set("io", io);

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);
  socket.on("join-freelancer", (freelancerId) => {
    socket.join(freelancerId);
    console.log("Freelancer joined room:", freelancerId);
  });
  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

console.log("Environment check:");
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("MONGODB_URI:", process.env.MONGODB_URI );
console.log("TOKEN_SECRET:", process.env.TOKEN);

mongoose.connect(process.env.MONGODB_URI)
.then(() => {
  console.log("MongoDB connected successfully");
  
  server.listen(PORT, () => {
    console.log(` Server running on port ${PORT}`);
    console.log(` CSRF Protection: Enabled`);
  });
})
.catch(err => {
  console.error("MongoDB connection failed:", err.message);
});
