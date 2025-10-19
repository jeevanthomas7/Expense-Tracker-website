import { Link } from "react-router-dom";
import bg from "../assets/g.jpg";

export default function Home() {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-[90vh] bg-cover bg-center relative"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="absolute inset-0 bg-black/60"></div>

      <div className="relative z-10 bg-white/10 backdrop-blur-lg p-10 rounded-2xl shadow-2xl text-center text-white max-w-2xl mx-4 border border-white/20">
        <h2 className="text-4xl font-extrabold mb-2 text-cyan-400 drop-shadow-md">
          Welcome to Expense Tracker
        </h2>
        <p className="text-gray-300 mb-8 text-lg font-light">
          Track Your Expenses Efficiently and Smartly with Ease.
        </p>

        <div className="bg-white/10 backdrop-blur-md p-8 rounded-xl shadow-lg border border-white/20 mx-auto max-w-md">
          <h3 className="text-2xl font-semibold mb-2 text-black">
            Manage Your Budget
          </h3>
          <p className="text-gray-300 mb-5 text-sm">
            Welcome Back! Keep Track of Your Income and Expenses.
          </p>

          <Link
            to="/login"
            className="bg-green-700 hover:text-blue-200 text-white py-3 px-8 rounded-lg text-lg font-semibold shadow-md transition-all duration-200"
          >
            Login to Continue
          </Link>
        </div>
      </div>
    </div>
  );
}
