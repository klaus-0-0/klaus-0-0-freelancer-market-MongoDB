💼 Freelancer Marketplace Application

A full-stack freelancer marketplace where clients post jobs and place bids, and freelancers receive bids in real time.
The application uses secure cookie-based authentication and Socket.IO for live updates.

🛠️ Tech Stack

🎨 Frontend
⚛️ React (Vite)
🌗 React Context API (Theme management)
🔁 Axios
🔌 Socket.IO Client
🎨 Tailwind CSS

⚙️ Backend
🟢 Node.js
🚂 Express.js
🍃 MongoDB
🧩 Mongoose
🔌 Socket.IO
🔐 JWT (stored in HTTP-only cookies)
🍪 Cookie-Parser
🌐 CORS

✨ Features
🔐 User authentication using JWT in HTTP-only cookies
👤 Clients can place bids on freelancers
⚡ Freelancers receive real-time bid updates
🛡️ Secure API access using cookies (withCredentials)
🌗 Light/Dark theme handled via Context API
🔊 Real-time communication using Socket.IO rooms

🚀 Installation & Setup
1️⃣ Clone the repository
git clone <your-repo-url>
cd <project-folder>

2️⃣ Backend Setup
cd backend
npm install
Create a .env file:

PORT=3000
MONGO_URI=mongodb://localhost:27017/freelancer
JWT_SECRET=your_jwt_secret

Start the backend:
npm main.js

3️⃣ Frontend Setup
cd frontend
npm install
npm run dev

🔐 Authentication Flo
On login/signup, the backend sets a JWT inside an HTTP-only cookie
The frontend sends requests using:
axios.defaults.withCredentials = true;


🌐 The browser automatically attaches cookies to API requests
🧠 Backend reads the token from req.cookies
🔔 Real-Time Bidding Flow
👤 Freelancer joins a Socket.IO room using their ID
💸 Client places a bid
📡 Backend emits a new-bid event to the freelancer’s room
⚡ Freelancer dashboard updates instantly
🌗 Theme Management (Context API)

Theme state (light/dark) is handled using React Context API
🌍 Theme is globally available across the app
🚫 No prop drilling
🧩 Easy to extend for more UI preferences
🗂️ Project Structure (Simplified)

frontend/
 ├─ src/
 │  ├─ context/
 │  │   └─ ThemeContext.jsx
 │  ├─ pages/
 │  ├─ components/
 │  └─ main.jsx

backend/
 ├─ models/
 ├─ routes/
 ├─ middleware/
 ├─ server.js

📝 Notes
🚫 No localStorage is used for authentication
🔒 Tokens are never accessible from JavaScript
🔌 Socket.IO uses the same authentication system
📈 Designed to be simple, secure, and scalable

📌 Status
Authentication: ✅
Real-time bids: ✅
Theme context: ✅
Core marketplace flow: ✅
