import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import bg from "../assets/g.jpg";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, mobile, password, confirmPassword } = form;

    if (!name || !mobile || !password || !confirmPassword) {
      return setError("All fields are required.");
    }
    if (password !== confirmPassword) {
      return setError("Passwords do not match.");
    }

    try {
      register({ name, mobile, password });
      setSuccess(" Registered successfully ✅! Redirecting to login...");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

      <div className="relative z-10 bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-96 text-white border border-white/20">
        <h2 className="text-3xl font-bold mb-6 text-center text-cyan-400">
          Create Account
        </h2>

        {error && <p className="text-red-400 text-sm text-center mb-4">{error}</p>}
        {success && <p className="text-green-400 text-bold text-center mb-4">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-white/20 placeholder-gray-300 text-white focus:ring-2 focus:ring-cyan-400 outline-none"
          />
          <input
            type="text"
            name="mobile"
            placeholder="Mobile Number"
            value={form.mobile}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-white/20 placeholder-gray-300 text-white focus:ring-2 focus:ring-cyan-400 outline-none"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-white/20 placeholder-gray-300 text-white focus:ring-2 focus:ring-cyan-400 outline-none"
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-white/20 placeholder-gray-300 text-white focus:ring-2 focus:ring-cyan-400 outline-none"
          />
          <button
            type="submit"
            className="w-full py-3 bg-green-600 rounded-lg font-semibold transition"
          >
            Register
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-300">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-cyan-400 hover:underline cursor-pointer"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
