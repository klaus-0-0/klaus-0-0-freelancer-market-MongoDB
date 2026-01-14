const dotenv = require("dotenv");
dotenv.config({ path: "../.env" });

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { Server } = require("socket.io");
const cookieParser = require("cookie-parser");
const http = require("http"); // ✅ REQUIRED

const app = express();
const server = http.createServer(app); // ✅ FIX

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PATCH", "OPTIONS"],
    credentials: true,
  },
});

// make io accessible inside routes
app.set("io", io);

app.use(cors({
  origin: "http://localhost:5173",
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

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");

    server.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch(console.error);
