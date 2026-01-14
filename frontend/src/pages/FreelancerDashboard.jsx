import { useEffect, useState } from "react";
import axios from "axios";
import config from "../config";
import { useNavigate } from "react-router-dom";
import logo from "../assets/freelancer.png";
import { io } from "socket.io-client";

const socket = io("https://klaus-0-0-freelancer-market-backend.onrender.com", {
  withCredentials: true
});

function FreelancerDashboard() {
  const navigate = useNavigate();
  const [bids, setBids] = useState([]);
  const [csrfToken, setCsrfToken] = useState(""); 

  // Fetch CSRF token on mount
  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const res = await axios.get(`${config.apiUrl}/csrf-token`);
        setCsrfToken(res.data.csrfToken);
      } catch (error) {
        console.error("Failed to fetch CSRF token", error.message);
      }
    };
    fetchCsrfToken();
  }, []);

  // Fetch bids & join room
  useEffect(() => {
    const fetchBids = async () => {
      try {
        const res = await axios.get(
          `${config.apiUrl}/bids/seller`,
          {
            withCredentials: true
          }
        );

        setBids(res.data.bids || []);

        // JOIN FREELANCER ROOM
        if (res.data.freelancerId) {
          socket.emit("join-freelancer", res.data.freelancerId);
        }
      } catch (error) {
        console.error(error, error.message);
      }
    };

    fetchBids();
  }, [navigate]);

  // Listen for real-time bids
  useEffect(() => {
    socket.on("new-bid", (data) => {
      const newBid = data.bid;
      console.log("New bid received:", newBid);
      setBids(prev => [newBid, ...prev]);
    });

    return () => socket.off("new-bid");
  }, []);

  // Accept / Reject
  const updateStatus = async (bidId, status) => {
    await axios.patch(
      `${config.apiUrl}/bids/${bidId}/status`,
      { status },
      {
        headers: {
          "X-CSRF-Token": csrfToken,
          "Content-Type": "application/json" 
        },
        withCredentials: true
      }
    );

    setBids(prev =>
      prev.map(b =>
        b._id === bidId ? { ...b, status } : b
      )
    );
  };

  // Logout
  const handleLogout = async () => {
    await axios.post(
      `${config.apiUrl}/logout`,
      {},
      {
        headers: {
          "X-CSRF-Token": csrfToken, // ← ADDED THIS HEADER
          "Content-Type": "application/json" // ← ADDED THIS HEADER
        },
        withCredentials: true
      }
    );
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white p-4 flex shadow">
        <img src={logo} className="h-12 w-12" />
        <h1 className="ml-2 text-2xl font-bold">Freelancer</h1>
        <div className="flex-1" />
        <button onClick={handleLogout} className="text-red-600 font-bold">
          Logout
        </button>
      </nav>

      <h3 className="text-xl font-bold m-4">Client Bids</h3>

      {bids.map(bid => (
        <div key={bid._id} className="border-b p-4">
          <p><b>Client:</b> {bid.client?.username}</p>
          <p><b>Amount:</b> ₹{bid.amount}</p>
          <p><b>Message:</b> {bid.message}</p>

          <p className="mt-1">
            <b>Status:</b>{" "}
            <span className={
              bid.status === "accepted"
                ? "text-green-600"
                : bid.status === "rejected"
                  ? "text-red-600"
                  : "text-yellow-600"
            }>
              {bid.status}
            </span>
          </p>

          {bid.status === "pending" && (
            <div className="flex gap-3 mt-2">
              <button
                onClick={() => updateStatus(bid._id, "accepted")}
                className="bg-green-600 text-white px-3 py-1 rounded"
              >
                Accept
              </button>
              <button
                onClick={() => updateStatus(bid._id, "rejected")}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                Reject
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default FreelancerDashboard;
