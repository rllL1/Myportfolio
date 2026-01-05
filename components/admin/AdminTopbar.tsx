"use client";

import { motion } from "framer-motion";
import { Bell, Search, Menu } from "lucide-react";

interface TopbarProps {
  toggleSidebar: () => void;
}

export default function AdminTopbar({ toggleSidebar }: TopbarProps) {
  return (
    <header className="bg-black/50 backdrop-blur-lg border-b border-red-600/30 sticky top-0 z-30">
      <div className="px-6 py-4 flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="lg:hidden text-gray-400 hover:text-red-600 transition-colors"
          >
            <Menu size={24} />
          </button>
          <div className="hidden md:block">
            <h1 className="text-xl font-bold text-white">
              Welcome back, <span className="text-red-600">Ron</span>!
            </h1>
            <p className="text-sm text-gray-400">Manage your portfolio content</p>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="hidden md:flex items-center gap-2 bg-black/50 border border-red-600/30 rounded-lg px-4 py-2">
            <Search size={18} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent border-none outline-none text-white text-sm w-64"
            />
          </div>

          {/* Notifications */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="relative p-2 text-gray-400 hover:text-red-600 transition-colors"
          >
            <Bell size={22} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full"></span>
          </motion.button>

          {/* Profile */}
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-r from-red-600 to-red-700 rounded-full flex items-center justify-center text-white font-bold">
              RA
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
