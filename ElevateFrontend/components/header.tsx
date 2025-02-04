// components/ui/header.tsx
import { FiBell } from "react-icons/fi";

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
      {/* Left Section - Page Title */}
      <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>

      {/* Right Section - Navigation Icons */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
          <FiBell className="w-6 h-6 text-gray-600" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
            S
          </div>
          <span className="text-gray-700 hidden md:inline">Sarah Johnson</span>
        </div>
      </div>
    </header>
  );
}
