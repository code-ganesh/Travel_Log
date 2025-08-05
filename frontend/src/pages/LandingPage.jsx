import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-full bg-cover bg-center flex items-center justify-center" style={{ backgroundImage: "url('/bg.png')" }}>
      <div className="bg-black bg-opacity-50 p-10 rounded-xl text-center text-white">
        <h1 className="text-4xl font-bold mb-6">Welcome to Your Travel Bucket Journey 🌍</h1>
        <button
          onClick={() => navigate("/login")}
          className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg text-lg transition-all duration-300"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}
