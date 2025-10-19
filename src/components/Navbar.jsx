import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-10 py-4 bg-white/10 text-white shadow-md">
      <h1 className="text-2xl font-bold text-cyan-500 tracking-wide">
        007  TRACKINGS
      </h1>
      <div className="flex items-center gap-10 text-sm font-medium">
        <Link to="/" className="hover:text-teal-400 transition">Home</Link>
        <Link to="/about" className="hover:text-teal-400 transition">About</Link>
        <Link
          to="/login"
          className="bg-blue-500  text-white px-4 py-2 rounded transition"
        >
          Login
        </Link>
      </div>
    </nav>
  );
}