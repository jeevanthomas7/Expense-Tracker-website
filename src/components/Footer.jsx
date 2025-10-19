export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white text-center py-3 fixed bottom-0 left-0 w-full shadow-lg">
      <p className="text-sm text-gray-400">
        © {new Date().getFullYear()} <span className="text-teal-400">Expense Tracker</span>. All rights reserved.
      </p>
    </footer>
  );
}
