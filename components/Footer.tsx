"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-red-600/20 py-8 px-6 bg-black">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400">
            Designed & Built by{" "}
            <span className="text-red-600 font-semibold">
              Ron Hezykiel Arbois
            </span>
          </p>
          <div className="flex gap-6">
            {[
              { Icon: Github, href: "https://github.com" },
              { Icon: Linkedin, href: "https://linkedin.com" },
              { Icon: Mail, href: "mailto:ron.arbois@example.com" },
            ].map(({ Icon, href }, index) => (
              <motion.a
                key={index}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2, rotate: 5 }}
                className="text-gray-400 hover:text-red-600 transition-colors"
              >
                <Icon size={20} />
              </motion.a>
            ))}
          </div>
        </div>
        <div className="text-center mt-4 text-gray-500 text-sm">
          © 2026 All rights reserved.
        </div>
      </div>
    </footer>
  );
}
