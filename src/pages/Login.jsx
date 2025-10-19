import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import bg from "../assets/g.jpg";

export default function Login() {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = (e) => {
    e.preventDefault();
    if (!mobile || !password) {
      setError("Please fill in both fields.");
      return;
    }

    const success = login(mobile, password);
    if (success) {
      navigate("/dashboard");
    } else {
      setError("Invalid mobile number or password.");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

      <div className="relative z-10 bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-96 text-white border border-white/20">
        <h2 className="text-3xl font-bold mb-6 text-center text-cyan-400">Login</h2>
        {error && <p className="text-red-400 text-sm text-center mb-4">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            placeholder="Mobile Number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            className="w-full p-3 rounded-lg bg-white/20 placeholder-gray-300 text-white focus:ring-2 focus:ring-cyan-400 outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-lg bg-white/20 placeholder-gray-300 text-white focus:ring-2 focus:ring-cyan-400 outline-none"
          />
          <button
            type="submit"
            className="w-full py-3 bg-green-700  rounded-lg font-semibold transition"
          >
            Login
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-300">
          New user?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-cyan-400 hover:underline cursor-pointer"
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
}
