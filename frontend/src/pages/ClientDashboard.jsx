import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../config";
import logo from "../assets/freelancer.png";

function ClientDashboard() {
  const navigate = useNavigate();
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBids = async () => {
      try {
        const res = await axios.get(
          `${config.apiUrl}/bids/client`,
          {
            withCredentials: true
          }
        );

        setBids(res.data.bids);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchBids();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white p-4 flex items-center shadow">
        <img src={logo} alt="logo" className="h-12 w-12" />
        <h1 className="font-bold text-2xl text-gray-700 ml-2">
          Client Dashboard
        </h1>

        <div className="flex-1"></div>

        <button
          className="text-gray-600 font-semibold hover:text-gray-400"
          onClick={() => navigate("/client")}
        >
          Find Freelancers
        </button>
      </nav>

      {/* CONTENT */}
      <div className="p-8 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          My Bids
        </h2>

        {loading ? (
          <p className="text-gray-500">Loading bids...</p>
        ) : bids.length === 0 ? (
          <p className="text-gray-500">You haven't placed any bids yet.</p>
        ) : (
          <div className="space-y-4">
            {bids.map((bid) => (
              <div
                key={bid._id}
                className="bg-white p-5 rounded-xl shadow flex justify-between items-center"
              >
                <div>
                  <h3 className="font-bold text-lg text-gray-800">
                    {bid.seller.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {bid.seller.role}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Bid Amount: ₹{bid.amount}
                  </p>
                </div>

                {/* STATUS */}
                <span
                  className={`px-4 py-1 rounded-full text-sm font-semibold ${bid.status === "accepted"
                      ? "bg-green-100 text-green-700"
                      : bid.status === "rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                >
                  {bid.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ClientDashboard;
