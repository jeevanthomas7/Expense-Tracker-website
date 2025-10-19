import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function Dashboard() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState(user?.transactions || []);
  const [form, setForm] = useState({
    description: "",
    amount: "",
    type: "Expense",
    category: "",
  });

  useEffect(() => {
    if (user) {
      setTransactions(user.transactions || []);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      const updatedUser = { ...user, transactions };
      updateUser(updatedUser);
    }
  }, [transactions]);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.amount || !form.category) return alert("Please fill all fields");

    const newTx = {
      id: Date.now(),
      date: new Date().toLocaleDateString(),
      month: new Date().toLocaleString("default", { month: "short" }),
      ...form,
      amount: Number(form.amount),
    };

    setTransactions((prev) => [newTx, ...prev]);
    setForm({ description: "", amount: "", type: "Expense", category: "" });
  };

  const totalIncome = transactions
    .filter((t) => t.type === "Income")
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "Expense")
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  const months = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec"
  ];

  const monthlyData = months.map((m) => {
    const income = transactions
      .filter((t) => t.type === "Income" && t.month === m)
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions
      .filter((t) => t.type === "Expense" && t.month === m)
      .reduce((sum, t) => sum + t.amount, 0);
    return { month: m, Income: income, Expense: expense };
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 text-gray-900 px-6 py-10">

      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-teal-600">Expense Tracker</h1>
        <div className="flex items-center gap-4">
          <span className="font-medium flex items-center gap-1">
            <span className="text-black font-semibold">Welcome! </span>
            <span className="text-blue-600 font-semibold">
              {user?.name || "Guest"}
            </span>
          </span>

          <button
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg text-sm transition"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-6 mb-10">
        <div className="bg-white shadow-md p-6 rounded-2xl text-center hover:shadow-lg transition">
          <h2 className="text-green-500 text-sm uppercase mb-1">Income</h2>
          <p className="text-3xl font-bold text-green-600">${totalIncome.toFixed(2)}</p>
        </div>
        <div className="bg-white shadow-md p-6 rounded-2xl text-center hover:shadow-lg transition">
          <h2 className="text-rose-500 text-sm uppercase mb-1">Expenses</h2>
          <p className="text-3xl font-bold text-rose-600">${totalExpenses.toFixed(2)}</p>
        </div>
        <div className="bg-white shadow-md p-6 rounded-2xl text-center hover:shadow-lg transition">
          <h2 className="text-teal-500 text-sm uppercase mb-1">Balance</h2>
          <p className="text-3xl font-bold text-teal-600">${balance.toFixed(2)}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 mb-10">
   
        <div className="lg:col-span-1 bg-white shadow-md p-6 rounded-2xl">
          <h2 className="text-lg font-semibold mb-4 text-teal-600">Add Transaction</h2>
          <form onSubmit={handleAdd} className="space-y-4">
            <input
              type="text"
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-teal-400 outline-none"
            />
            <input
              type="number"
              placeholder="Amount"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-teal-400 outline-none"
            />
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-teal-400 outline-none"
            >
              <option>Expense</option>
              <option>Income</option>
            </select>
            <input
              type="text"
              placeholder="Category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-teal-400 outline-none"
            />
            <button
              type="submit"
              className="w-full bg-teal-500 hover:bg-teal-600 py-3 rounded-lg text-white font-semibold transition"
            >
              Add
            </button>
          </form>
        </div>

     
        <div className="lg:col-span-2 bg-white shadow-md p-6 rounded-2xl flex flex-col justify-center items-center">
          <h2 className="text-lg font-semibold mb-4 text-teal-600">Monthly Spending Overview</h2>
          <div className="h-80 w-full flex justify-center">
            {transactions.length > 0 ? (
              <ResponsiveContainer width="95%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="Income" fill="#14b8a6" radius={[5, 5, 0, 0]} />
                  <Bar dataKey="Expense" fill="#f43f5e" radius={[5, 5, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 text-center pt-20">
                No data yet — add transactions to see your monthly graph!
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white shadow-md p-6 rounded-2xl">
        <h2 className="text-lg font-semibold mb-4 text-teal-600">Recent Transactions</h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b text-gray-500 text-sm">
              <th className="pb-2">Date</th>
              <th className="pb-2">Category</th>
              <th className="pb-2">Type</th>
              <th className="pb-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length > 0 ? (
              transactions.map((t) => (
                <tr key={t.id} className="border-b hover:bg-gray-100 transition">
                  <td className="py-2">{t.date}</td>
                  <td>{t.category}</td>
                  <td>{t.type}</td>
                  <td
                    className={`font-medium ${
                      t.type === "Expense" ? "text-rose-500" : "text-green-500"
                    }`}
                  >
                    ${t.amount.toFixed(2)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">
                  No transactions yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
