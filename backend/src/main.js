const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { Server } = require("socket.io");
const cookieParser = require("cookie-parser");
const http = require("http"); 
// dotenv.config({ path: "../.env" });
const { loadEnv } = require("./config"); 

// Load environment variables
loadEnv();

const app = express();
const server = http.createServer(app); 

const io = new Server(server, {
  cors: {
    origin: "https://klaus-0-0-freelancer-market.onrender.com",
    methods: ["GET", "POST", "PATCH", "OPTIONS"],
    credentials: true,
  },
});

// make io accessible inside routes
app.set("io", io);

app.use(cors({
  origin: "https://klaus-0-0-freelancer-market.onrender.com",
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());

app.use("/api", require("../src/routes/authRoutes"));
app.use("/api", require("../src/routes/sellerRoutes"));
app.use("/api", require("../src/routes/bidRoutes"));

app.get("/", (req, res) => {
  res.json({ message: "API running" });
});

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("join-freelancer", (freelancerId) => {
    const room = freelancerId;
    socket.join(room);
    console.log("Freelancer joined room:", room);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

console.log("MONGO_URI =", process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");

    server.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch(console.error);
