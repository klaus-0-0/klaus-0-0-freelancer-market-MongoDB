import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Signup from "./pages/Signup"
import Login from "./pages/Login"
import Freelancer from "./pages/Freelancer"
import Client from "./pages/Client"
import FreelancerDashboard from "./pages/FreelancerDashboard"
import ClientDashboard from "./pages/ClientDashboard"
import { ThemeProvider } from "./context/ThemeContext";

function App() {

  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/Home" element={< Home />} />
          <Route path="/" element={< Signup />} />
          <Route path="signup" element={< Signup />} />
          <Route path="login" element={< Login />} />
          <Route path="Freelancer" element={< Freelancer />} />
          <Route path="client" element={< Client />} />
          <Route path="FreelancerDashboard" element={< FreelancerDashboard />} />
          <Route path="ClientDashboard" element={< ClientDashboard />} />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App
