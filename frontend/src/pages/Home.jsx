import { useNavigate } from "react-router-dom";
import wall from "../assets/e1.jpg"
import logo from "../assets/freelancer.png"
import { useState } from "react";
import f4 from "../assets/f4.jpg"
import f5 from "../assets/f5.jpg"
import f6 from "../assets/f6.jpg"
import { useEffect } from "react";
import { useTheme } from "../context/ThemeContext"; // Import the theme hook

function Home() {
    const navigate = useNavigate();
    const [images] = useState([f4, f5, f6]);
    const [showImg, setShowImg] = useState(images[0]);

    // Theme context-API
    const { isDarkMode, toggleTheme } = useTheme();

    const bgColor = isDarkMode ? "bg-gray-900" : "bg-white";
    const navBgColor = isDarkMode ? "bg-gray-800" : "bg-white";

    // for rendering images in a loop
    useEffect(() => {
        const imageLength = images.length;

        for (let i = 0; i < imageLength; i++) {
            setTimeout(() => {
                setShowImg(images[i]);
                console.log("i = ", i);
            }, 3000 * i);
        }

        // loop infinitely
        const interval = setInterval(() => {
            for (let i = 0; i < imageLength; i++) {
                setTimeout(() => {
                    setShowImg(images[i]);
                }, 3000 * i);
            }
        }, 3000 * imageLength);

        return () => clearInterval(interval);
    }, [images]);

    const handleLogout = () => {
        localStorage.removeItem("userdata");
        navigate("/login");
    };

    return (
        <div className={`min-h-screen transition-colors duration-300 ${bgColor}`}>
            <nav className={`sticky top-0 z-50 flex items-center gap-2 font-bold text-2xl p-6 border-b-2 ${navBgColor}`}>
                <img src={logo} className="h-14 w-14"></img>
                <h1 className="font-bold text-3xl md:text-4xl text-gray-700 font-serif">
                    Freelancer
                </h1>
                <div className="flex-1"></div>
                <div className="flex gap-3 md:gap-5 justify-end">
                    <button onClick={toggleTheme} className="cursor-pointer text-gray-700"
                    >theme
                    </button>
                    <button
                        className="cursor-pointer text-gray-600 font-bold text-sm md:text-base hover:text-gray-400 transition px-2 py-1 md:px-0"
                        onClick={() => navigate("/home")}
                    >
                        help
                    </button>
                    <button
                        className="cursor-pointer text-gray-600 font-bold text-sm md:text-base hover:text-gray-400 transition px-2 py-1 md:px-0"
                        onClick={() => handleLogout()}
                    >
                        Signout
                    </button>
                </div>
            </nav>

            <div className="relative">
                <img
                    src={showImg}
                    className="w-full h-[40vh] md:h-[90vh] object-cover"
                    alt="Background img"
                />

                <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
                    <p className="font-bold text-3xl md:text-5xl lg:text-6xl text-white text-center max-w-4xl leading-tight mb-6 md:mb-8">
                        Connecting businesses<br />
                        in need to freelancers who deliver<br />
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mt-4 md:mt-6">
                        <button
                            className="bg-white text-sky-900 px-6 py-2 md:px-8 md:py-3 rounded-lg font-semibold hover:bg-gray-300 transition cursor-pointer text-base md:text-lg shadow-lg hover:shadow-xl"
                            onClick={() => navigate("/client")}
                        >
                            I am a client
                        </button>
                        <button
                            className="bg-black/40 border-2 border-white text-white px-6 py-2 md:px-8 md:py-3 rounded-lg font-semibold hover:bg-black/70 transition cursor-pointer text-base md:text-lg"
                            onClick={() => navigate("/Freelancer")}
                        >
                            I'm a freelancer
                        </button>
                    </div>
                </div>
            </div>

            <div className="py-12 px-4 md:px-8">
                <h2 className="text-3xl font-bold text-center text-sky-900 mb-8">
                    Welcome to Freelancing
                </h2>
            </div>
        </div>
    )
}

export default Home;