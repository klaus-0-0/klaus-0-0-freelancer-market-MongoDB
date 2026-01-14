import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../config";

import logo from "../assets/freelancer.png";
import f1 from "../assets/f1.jpg";

import p3 from "../assets/p3.jpg";
import p4 from "../assets/p4.jpg";
import p5 from "../assets/p5.jpg";
import p6 from "../assets/p6.jpg";

function Freelancer() {
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [name, setName] = useState("");
  const [skill, setSkill] = useState("");
  const [experience, setExperience] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [role, setRole] = useState("");
  const [description, setDescription] = useState("");

  const categories = [
    { id: 1, title: "I am a Developer", img: p6, skills: "React, Node, MongoDB" },
    { id: 2, title: "I am a Designer", img: p5, skills: "Figma, Photoshop" },
    { id: 3, title: "I am an Editor", img: p3, skills: "Premiere Pro, After Effects" },
    { id: 4, title: "I am a Writer", img: p4, skills: "Content Writing, SEO" },
  ];

  const handleOpenForm = (category) => {
    setSelectedCategory(category);
  };

  const handleCloseForm = () => {
    setSelectedCategory(null);
  };

  const handleSubmit = async () => {
    if (!name || !role || !skill || !experience || !hourlyRate || !description) {
      alert("All fields are required");
      return;
    }

    try {
      await axios.post(`${config.apiUrl}/seller`,
        {
          name,
          role,
          skill,
          experience: Number(experience),
          hourlyRate: Number(hourlyRate),
          description,
        },
        {
          headers: {
            withCredentials: true
          },
        }
      );

      alert("Seller profile created successfully");
      handleCloseForm();
      navigate("/freelancerdashboard");
    } catch (error) {
      console.error(error.message);
      alert("Failed to create seller profile");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-white">

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white p-4 flex items-center shadow">
        <img src={logo} alt="logo" className="h-14 w-14" />
        <h1 className="font-bold text-3xl text-gray-700 font-serif ml-2">
          Freelancer
        </h1>

        <div className="flex-1"></div>

        <div className="flex gap-5">
          <button
            className="text-gray-600 font-bold hover:text-gray-400"
            onClick={() => navigate("/freelancerdashboard")}
          >
            Bids
          </button>
          <button
            className="text-red-600 font-bold hover:text-red-400"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </nav>

      {/* center img */}
      <div className="relative">
        <img src={f1} alt="hero" className="w-full h-[40vh] md:h-screen object-cover" />

        <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
          <p className="bg-black/60 px-6 py-4 font-bold text-3xl md:text-5xl text-white text-center rounded-lg">
            Work Your Way <br />
            You bring the skill. We'll make earning easy.
          </p>

          <button
            onClick={() => handleOpenForm(categories[0])}
            className="mt-6 bg-white text-sky-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition shadow-lg"
          >
            Become a Seller
          </button>
        </div>
      </div>

      {/* CATEGORY */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-6 py-12">
        {categories.map((item) => (
          <button
            key={item.id}
            onClick={() => handleOpenForm(item)}
            className="relative group h-72 w-full rounded-xl overflow-hidden shadow-lg cursor-pointer"
          >
            <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition" />
            <div className="absolute inset-0 bg-black/40 flex items-end justify-center">
              <h2 className="text-white text-xl font-bold uppercase">{item.title}</h2>
            </div>
          </button>
        ))}
      </div>

      {/* MODAL FORM */}
      {selectedCategory && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
          <div className="bg-white rounded-xl w-[90%] max-w-lg p-6 relative">

            {/* CLOSE */}
            <button
              onClick={handleCloseForm}
              className="absolute top-3 right-3 text-xl text-gray-500 hover:text-black"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold mb-4">
              {selectedCategory.title}
            </h2>

            <div className="space-y-1">
              <label className="block text-sm font-semibold text-gray-600">
                Full Name
              </label>
              <input
                required
                type="text"
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500"
                placeholder="Your name"
                onChange={(e) => setName(e.target.value)}
              />

              <label className="block text-sm font-semibold text-gray-600">
                Role
              </label>
              <input
                required
                type="text"
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500"
                placeholder="ex, developer, designer"
                onChange={(e) => setRole(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600">
                Skills
              </label>
              <input
                required
                type="text"
                className="w-full border rounded-lg px-3 py-2"
                placeholder={selectedCategory.skills}
                onChange={(e) => setSkill(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600">
                Experience (Years)
              </label>
              <input
                type="number"
                min="0"
                className="w-full border rounded-lg px-3 py-2"
                placeholder="e.g. 2"
                onChange={(e) => setExperience(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600">
                Hourly Rate (₹)
              </label>
              <input
                type="number"
                className="w-full border rounded-lg px-3 py-2"
                placeholder="e.g. 500"
                onChange={(e) => setHourlyRate(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600">
                description
              </label>
              <textarea
                type="number"
                className="w-full border rounded-lg px-3 py-2"
                placeholder="about yourself"
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <button
              onClick={() => handleSubmit()}
              className="w-full bg-sky-600 text-white py-2 rounded-lg font-semibold hover:bg-sky-700 transition mt-2"
            >
              Submit Profile
            </button>

          </div>
        </div>
      )}
    </div>
  );
}

export default Freelancer;
