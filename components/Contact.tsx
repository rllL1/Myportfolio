"use client";

import { motion } from "framer-motion";
import { Mail, Linkedin, Github } from "lucide-react";

export default function Contact() {
  return (
    <section id="contact" className="relative py-20 px-6 bg-gradient-to-b from-[#0a0a0a] to-[#171717] border-t border-red-600/20 overflow-hidden">
      {/* Animated spotlight effect */}
      <motion.div
        animate={{
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-600/10 rounded-full blur-3xl"
      />
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto text-center relative z-10"
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Let&apos;s <span className="text-red-600">Connect</span>
        </h2>
        <p className="text-xl text-gray-300 mb-12">
          Always open to discussing new projects and opportunities
        </p>

        <div className="flex flex-wrap gap-6 justify-center mb-12">
          {[
            {
              Icon: Mail,
              text: "Email Me",
              href: "mailto:arboisron2@gmail.com",
            },
            {
              Icon: Linkedin,
              text: "LinkedIn",
              href: "https://www.linkedin.com/in/ron-hezykiel-arbois-5297b9297/",
            },
            { Icon: Github, text: "GitHub", href: "https://github.com/rllL1" },
          ].map((item, index) => (
            <motion.a
              key={index}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ 
                scale: 1.05, 
                y: -5,
                boxShadow: "0 20px 40px rgba(220, 38, 38, 0.5)",
              }}
              whileTap={{ scale: 0.95 }}
              className="relative flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-lg font-semibold shadow-lg shadow-red-600/50 transition-all overflow-hidden group"
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <item.Icon size={20} className="relative z-10" />
              <span className="relative z-10">{item.text}</span>
            </motion.a>
          ))}
        </div>

        {/* Glassmorphism Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-red-600/10 to-black/50 backdrop-blur-lg border border-red-600/30 rounded-2xl p-8 max-w-2xl mx-auto"
        >
          <p className="text-gray-300 text-lg mb-4">
            &quot;Building the future, one line of code at a time.&quot;
          </p>
          <p className="text-red-600 font-semibold">- Ron Hezykiel Arbois</p>
        </motion.div>
      </motion.div>
    </section>
  );
}
