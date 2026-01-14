import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../assets/freelancer.png";
import config from "../config";

function Client() {
    const navigate = useNavigate();
    const [freelancers, setFreelancers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showBidForm, setShowBidForm] = useState(false);
    const [selectedSeller, setSelectedSeller] = useState(null);
    const [bidData, setBidData] = useState({ amount: "", message: "" });
    const [clientId, setClientId] = useState("");
    const [csrfToken, setCsrfToken] = useState(""); // ← ADDED THIS LINE

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

    // Get clientId from localStorage on mount
    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("userData"));
        if (userData) {
            setClientId(userData.userId);
            console.log("Logged in clientId:", userData.userId);
        }
    }, []);

    // Fetch freelancers on mount
    useEffect(() => {
        const fetchFreelancers = async () => {
            try {
                const res = await axios.get(`${config.apiUrl}/sellers`, {
                    withCredentials: true
                });
                setFreelancers(res.data);
            } catch (error) {
                console.error("Error fetching freelancers:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFreelancers();
    }, []);

    // Open bid form
    const openBidForm = (seller) => {
        setSelectedSeller(seller);
        setBidData({ amount: "", message: "" });
        setShowBidForm(true);
    };

    // Submit bid
    const handleBidSubmit = async () => {
        if (!bidData.amount || !bidData.message) {
            alert("Please fill all fields");
            return;
        }

        try {
            await axios.post(`${config.apiUrl}/bids`,
                {
                    seller: selectedSeller._id,
                    client: clientId,
                    amount: bidData.amount,
                    message: bidData.message
                },
                {
                    headers: {
                        "X-CSRF-Token": csrfToken // ← ADDED THIS HEADER
                    },
                    withCredentials: true
                }
            );

            alert("Bid sent successfully!");
            setShowBidForm(false);
            navigate("/clientdashboard");
        } catch (error) {
            console.error("Bid failed:", error.response?.data || error.message);
            alert("Failed to send bid");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("userData");
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* NAVBAR */}
            <nav className="sticky top-0 z-50 bg-white p-4 flex items-center shadow">
                <img src={logo} alt="logo" className="h-14 w-14" />
                <h1 className="font-bold text-3xl text-gray-700 font-serif ml-2">Freelancer</h1>
                <div className="flex-1"></div>
                <div className="flex gap-5">
                    <button className="text-gray-600 font-bold hover:text-gray-400" onClick={() => navigate("/clientdashboard")}>MY-Bid</button>
                    <button className="text-red-600 font-bold hover:text-red-400" onClick={handleLogout}>Logout</button>
                </div>
            </nav>
            <div className="flex items-center justify-center mt-5">
                <input className="w-100 h-10 rounded-2xl border-2 text-center" placeholder="search..."></input>
            </div>
            {/* CONTENT */}
            <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-700 mb-6">Available Freelancers</h2>

                {loading ? (
                    <p className="text-gray-500">Loading freelancers...</p>
                ) : freelancers.length === 0 ? (
                    <p className="text-gray-500">No freelancers found</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {freelancers.map((freelancer) => (
                            <div key={freelancer._id} className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition">
                                <h3 className="text-xl font-bold text-gray-800">{freelancer.name}</h3>
                                <p className="text-sm text-gray-500 mt-1">{freelancer.skill}</p>
                                <p className="text-gray-600 mt-3 text-sm line-clamp-3">{freelancer.description}</p>
                                <div className="flex justify-between items-center mt-4">
                                    <span className="text-sm font-semibold text-green-600">₹{freelancer.hourlyRate}/hr</span>
                                    <button
                                        className="px-4 py-1 text-sm bg-gray-800 text-white rounded-lg hover:bg-gray-700 cursor-pointer"
                                        onClick={() => openBidForm(freelancer)}
                                    >
                                        Bid
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* BID FORM MODAL */}
                {showBidForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="bg-white p-6 rounded-xl w-full max-w-md">
                            <h3 className="text-xl font-bold mb-4">Send Bid to {selectedSeller.name}</h3>

                            <div className="mb-3">
                                <label className="block text-gray-700">Bid Amount:</label>
                                <input
                                    type="number"
                                    className="w-full border p-2 rounded"
                                    value={bidData.amount}
                                    onChange={(e) => setBidData({ ...bidData, amount: e.target.value })}
                                />
                            </div>

                            <div className="mb-3">
                                <label className="block text-gray-700">Message:</label>
                                <textarea
                                    className="w-full border p-2 rounded"
                                    value={bidData.message}
                                    onChange={(e) => setBidData({ ...bidData, message: e.target.value })}
                                ></textarea>
                            </div>

                            <div className="flex justify-end gap-3">
                                <button className="px-4 py-2 bg-gray-300 rounded" onClick={() => setShowBidForm(false)}>Cancel</button>
                                <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={handleBidSubmit}>Send Bid</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Client;
