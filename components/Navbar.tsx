"use client";

import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 w-full bg-black/80 backdrop-blur-lg border-b border-red-600/20 z-50"
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="text-2xl font-bold"
          >
            <span className="text-white">Ron</span>
            <span className="text-red-600">.</span>
            <span className="text-white">dev</span>
          </motion.div>
          <div className="flex gap-8">
            {["Home", "Skills", "Projects", "Resume", "Contact"].map((item) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                whileHover={{ scale: 1.1, color: "#dc2626" }}
                transition={{ duration: 0.2 }}
                className="hover:text-red-600 transition-colors cursor-pointer"
              >
                {item}
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
