import { useState, useEffect, useMemo } from "react";
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

  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterCategory, setFilterCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    if (user) {
      setTransactions(user.transactions || []);
    }
  }, [user]);

  const saveTransactions = (newTxs) => {
    setTransactions(newTxs);
    if (user) {
      updateUser({ ...user, transactions: newTxs });
    }
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.amount || !form.category || !form.description) return alert("Please fill all fields");

    const newTx = {
      id: Date.now(),
      date: new Date().toLocaleDateString(),
      month: new Date().toLocaleString("default", { month: "short" }),
      ...form,
      amount: Number(form.amount),
    };

    saveTransactions([newTx, ...transactions]);
    setForm({ description: "", amount: "", type: "Expense", category: "" });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      const filtered = transactions.filter((t) => t.id !== id);
      saveTransactions(filtered);
    }
  };

  const totalIncome = transactions
    .filter((t) => t.type === "Income")
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "Expense")
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((t) => {
        const matchesSearch = t.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = filterType === "All" || t.type === filterType;
        const matchesCategory = filterCategory === "All" || t.category === filterCategory;
        return matchesSearch && matchesType && matchesCategory;
      })
      .sort((a, b) => {
        if (sortBy === "newest") return b.id - a.id;
        if (sortBy === "oldest") return a.id - b.id;
        if (sortBy === "highest") return b.amount - a.amount;
        if (sortBy === "lowest") return a.amount - b.amount;
        return 0;
      });
  }, [transactions, searchQuery, filterType, filterCategory, sortBy]);

  const categories = ["All", ...new Set(transactions.map((t) => t.category))];

  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 text-gray-900 px-4 py-8 md:px-10">
      
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <h1 className="text-4xl font-extrabold text-teal-600 tracking-tight">WalletInsight</h1>
        <div className="flex items-center gap-6 bg-white px-4 py-2 rounded-2xl shadow-sm border border-gray-100">
          <div className="text-right">
            <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Active User</p>
            <p className="text-teal-600 font-semibold">{user?.name || "Guest"}</p>
          </div>
          <button
            onClick={() => { logout(); navigate("/login"); }}
            className="bg-rose-500 hover:bg-rose-600 text-white px-5 py-2 rounded-xl text-sm font-bold transition-all transform hover:scale-105 active:scale-95 shadow-md"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-3xl shadow-lg border-b-4 border-green-500 hover:shadow-xl transition-all">
          <p className="text-green-500 text-xs font-black uppercase mb-2">Total Income</p>
          <p className="text-3xl font-extrabold text-gray-800">${totalIncome.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-lg border-b-4 border-rose-500 hover:shadow-xl transition-all">
          <p className="text-rose-500 text-xs font-black uppercase mb-2">Total Expenses</p>
          <p className="text-3xl font-extrabold text-gray-800">${totalExpenses.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-lg border-b-4 border-teal-500 hover:shadow-xl transition-all">
          <p className="text-teal-500 text-xs font-black uppercase mb-2">Net Balance</p>
          <p className="text-3xl font-extrabold text-gray-800">${balance.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
            <h2 className="text-xl font-bold mb-6 text-gray-700 flex items-center gap-2">
              <span className="w-2 h-6 bg-teal-500 rounded-full"></span>
              Add Transaction
            </h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <input
                type="text"
                placeholder="Description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-teal-400 outline-none transition-all"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  placeholder="Amount"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-teal-400 outline-none transition-all"
                />
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-teal-400 outline-none transition-all"
                >
                  <option value="Expense">Expense</option>
                  <option value="Income">Income</option>
                </select>
              </div>
              <input
                type="text"
                placeholder="Category"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-teal-400 outline-none transition-all"
              />
              <button
                type="submit"
                className="w-full bg-teal-500 hover:bg-teal-600 py-4 rounded-2xl text-white font-bold text-lg shadow-lg shadow-teal-200 transition-all active:scale-95"
              >
                Save Transaction
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-10">
          
          <div className="bg-white p-8 rounded-3xl shadow-xl">
            <h2 className="text-xl font-bold mb-6 text-gray-700">Financial Growth</h2>
            <div className="h-72 w-full">
              {transactions.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                    <Bar dataKey="Income" fill="#10b981" radius={[8, 8, 0, 0]} barSize={20} />
                    <Bar dataKey="Expense" fill="#f43f5e" radius={[8, 8, 0, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                   <p>No data to visualize yet.</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <h2 className="text-xl font-bold text-gray-700">Recent History</h2>
              
              <div className="flex flex-wrap gap-2 w-full md:w-auto">
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-400 outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <select 
                  className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="All">All Types</option>
                  <option value="Income">Income</option>
                  <option value="Expense">Expense</option>
                </select>
                <select 
                  className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="highest">Highest $</option>
                  <option value="lowest">Lowest $</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-gray-400 text-xs uppercase tracking-widest border-b border-gray-50">
                    <th className="pb-4 font-black">Date</th>
                    <th className="pb-4 font-black">Details</th>
                    <th className="pb-4 font-black">Category</th>
                    <th className="pb-4 font-black text-right">Amount</th>
                    <th className="pb-4 font-black text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredTransactions.length > 0 ? (
                    filteredTransactions.map((t) => (
                      <tr key={t.id} className="group hover:bg-gray-50 transition-colors">
                        <td className="py-4 text-sm text-gray-500">{t.date}</td>
                        <td className="py-4">
                          <p className="font-bold text-gray-700 capitalize">{t.description}</p>
                          <p className="text-xs text-gray-400">{t.type}</p>
                        </td>
                        <td className="py-4">
                          <span className="px-3 py-1 bg-teal-50 text-teal-600 rounded-full text-xs font-bold">
                            {t.category}
                          </span>
                        </td>
                        <td className={`py-4 text-right font-black ${t.type === 'Expense' ? 'text-rose-500' : 'text-green-500'}`}>
                          {t.type === 'Expense' ? '-' : '+'}${t.amount.toFixed(2)}
                        </td>
                        <td className="py-4 text-center">
                          <button 
                            onClick={() => handleDelete(t.id)}
                            className="text-gray-300 hover:text-rose-500 transition-colors p-2"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center py-10 text-gray-400 italic">
                        No transactions found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
