import React from "react";
import bg from "../assets/g.jpg";

export default function About() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center relative text-white px-6"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

      <div className="relative z-10 text-center  mb-20 max-w-2xl">
        <h1 className="text-4xl font-bold text-cyan-400 mb-8">
          About Expense Tracker
        </h1>
        <p className="text-gray-200 text-lg leading-relaxed">
          Expense Tracker helps you manage your daily spending and savings
          easily. Track your expenses, monitor income, and stay financially
          organized — all in one simple place.
        </p>
      </div>
    </div>
  );
}
