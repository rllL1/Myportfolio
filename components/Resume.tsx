"use client";

import { motion } from "framer-motion";
import { Briefcase, GraduationCap, Download, Eye } from "lucide-react";

export default function Resume() {
  const timeline = [
    {
      type: "work",
      title: "Vibe Coding Specialist",
      company: "Creative Digital Studio",
      period: "2024 - Present",
      description:
        "Creating modern, aesthetic web experiences with cutting-edge technologies and design patterns.",
    },
    {
      type: "work",
      title: "Frontend Developer",
      company: "Web Solutions Agency",
      period: "2023 - 2024",
      description:
        "Building responsive and interactive user interfaces using React, Next.js, and modern CSS frameworks.",
    },
    {
      type: "education",
      title: "Computer Science",
      company: "St. Dominic Savio College",
      period: "2025 - 2026",
      description: "Studying computer science fundamentals, web development, and software engineering.",
    },
  ];

  return (
    <section id="resume" className="relative py-20 px-6 bg-[#0a0a0a] overflow-hidden">
      {/* Radial gradient background */}
      <div className="absolute inset-0 bg-gradient-radial from-red-950/10 via-transparent to-transparent" />
      
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="max-w-5xl mx-auto relative z-10"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
          My <span className="text-red-600">Journey</span>
        </h2>
        <p className="text-center text-gray-400 mb-8 text-lg">
          Experience and education timeline
        </p>

        {/* Resume PDF Buttons */}
        <div className="flex flex-wrap gap-4 justify-center mb-12">
          <motion.a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-3 px-8 py-4 bg-red-600 hover:bg-red-700 rounded-lg font-semibold shadow-lg shadow-red-600/50 transition-all"
          >
            <Eye size={20} />
            <span>View PDF Resume</span>
          </motion.a>
          <motion.a
            href="/resume.pdf"
            download="Ron_Hezykiel_Arbois_Resume.pdf"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-3 px-8 py-4 border-2 border-red-600 hover:bg-red-600/10 rounded-lg font-semibold transition-all"
          >
            <Download size={20} />
            <span>Download Resume</span>
          </motion.a>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-red-600 via-red-600/50 to-transparent"></div>

          <div className="space-y-12">
            {timeline.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative pl-20"
              >
                {/* Red dot */}
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 + 0.3 }}
                  className="absolute left-6 top-2 w-5 h-5 bg-red-600 rounded-full border-4 border-[#0a0a0a] shadow-lg shadow-red-600/50"
                ></motion.div>

                {/* Icon */}
                <div className="absolute left-2 top-0 w-12 h-12 bg-red-600/10 border border-red-600/30 rounded-full flex items-center justify-center">
                  {item.type === "work" ? (
                    <Briefcase className="text-red-600" size={20} />
                  ) : (
                    <GraduationCap className="text-red-600" size={20} />
                  )}
                </div>

                {/* Content Card */}
                <motion.div
                  whileHover={{ scale: 1.02, x: 10 }}
                  className="bg-gradient-to-br from-red-950/30 to-black border border-red-600/30 rounded-xl p-6 hover:border-red-600 transition-all"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-2xl font-bold text-white">
                      {item.title}
                    </h3>
                    <span className="text-red-600 font-semibold text-sm px-3 py-1 bg-red-600/10 rounded-full">
                      {item.period}
                    </span>
                  </div>
                  <p className="text-red-400 font-semibold mb-3">
                    {item.company}
                  </p>
                  <p className="text-gray-400">{item.description}</p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
