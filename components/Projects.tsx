"use client";

import { motion } from "framer-motion";
import { Code2, ExternalLink } from "lucide-react";
import Image from "next/image";

export default function Projects() {
  const projects = [
    {
      title: "Online Enrollment System",
      description:
        "Comprehensive student enrollment platform with course registration, student management, and administrative features.",
      tags: ["PHP", "MySQL", "Bootstrap"],
      image: "/1.png",
    },
    {
      title: "Library Management System",
      description:
        "Complete library solution for book cataloging, borrowing management, and tracking system with user authentication.",
      tags: ["PHP", "MySQL", "JavaScript"],
      image: "/3.jpg",
    },
    {
      title: "Automated Generated Docs Report",
      description:
        "Automated document generation system for creating professional reports with real-time data integration and export capabilities.",
      tags: ["Next.js", "Supabase", "TypeScript"],
      image: "/4.png",
    },
  ];

  return (
    <section
      id="projects"
      className="relative py-20 px-6 bg-gradient-to-b from-[#171717] to-[#0a0a0a] overflow-hidden"
    >
      {/* Floating orbs in background */}
      <motion.div
        animate={{
          y: [0, -30, 0],
          x: [0, 20, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-20 left-10 w-72 h-72 bg-red-600/5 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          y: [0, 30, 0],
          x: [0, -20, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-20 right-10 w-96 h-96 bg-red-600/5 rounded-full blur-3xl"
      />
      
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="max-w-7xl mx-auto relative z-10"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
          Featured <span className="text-red-600">Projects</span>
        </h2>
        <p className="text-center text-gray-400 mb-12 text-lg">
          Recent work that showcases my skills
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ 
                scale: 1.02,
                y: -10,
                boxShadow: "0 25px 50px rgba(220, 38, 38, 0.3)",
              }}
              className="group relative bg-gradient-to-br from-red-950/20 to-black border border-red-600/30 rounded-2xl overflow-hidden hover:border-red-600 transition-all duration-300 cursor-pointer"
            >
              {/* Enhanced Glow effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-red-600/0 via-red-600/20 to-red-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <motion.div
                className="absolute -inset-1 bg-gradient-to-r from-red-600 to-red-800 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500"
              />

              {/* Image Container */}
              <div className="relative h-64 bg-gradient-to-br from-[#171717] to-[#0a0a0a] overflow-hidden">
                {project.image && (
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover"
                  />
                )}
                {!project.image && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Code2 size={80} className="text-red-600/30" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-all duration-300 z-10"></div>
              </div>

              {/* Content */}
              <div className="relative p-6 space-y-4">
                <h3 className="text-2xl font-bold text-white group-hover:text-red-600 transition-colors">
                  {project.title}
                </h3>
                <p className="text-gray-400">{project.description}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-3 py-1 bg-red-600/20 border border-red-600/50 rounded-full text-sm text-red-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* View Project Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 text-red-600 hover:text-red-400 transition-colors mt-4"
                >
                  <span>View Project</span>
                  <ExternalLink size={16} />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
