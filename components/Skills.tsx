"use client";

import { motion } from "framer-motion";
import { Code2 } from "lucide-react";

export default function Skills() {
  const skills = [
    "C#",
    "JavaScript",
    "TypeScript",
    "PHP",
    "HTML5",
    "CSS3",
    "React",
    "Next.js",
    "Node.js",
    "Laravel",
    "Tailwind CSS",
    "Bootstrap",
    "MySQL",
    "MSSQL",
    "Figma",
  ];

  return (
    <section id="skills" className="relative py-20 px-6 overflow-hidden bg-[#171717]">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(220, 38, 38, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(220, 38, 38, 0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }} />
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto relative z-10"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
          Tech <span className="text-red-600">Stack</span>
        </h2>
        <p className="text-center text-gray-400 mb-12 text-lg">
          Technologies I work with daily
        </p>

        {/* Marquee Container */}
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#171717] to-transparent z-10"></div>
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#171717] to-transparent z-10"></div>

          <motion.div
            animate={{
              x: [0, -1920],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 20,
                ease: "linear",
              },
            }}
            className="flex gap-6"
          >
            {[...skills, ...skills, ...skills].map((skill, index) => (
              <div
                key={index}
                className="flex-shrink-0 px-8 py-6 bg-gradient-to-br from-red-600/20 to-black border border-red-600/30 rounded-xl backdrop-blur-sm min-w-[200px]"
              >
                <div className="flex items-center gap-3">
                  <Code2 className="text-red-600" size={24} />
                  <span className="text-xl font-semibold">{skill}</span>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Skill Categories Grid */}
        <div className="grid md:grid-cols-3 gap-6 mt-16">
          {[
            {
              title: "Programming Languages",
              skills: ["C#", "JavaScript", "TypeScript", "PHP", "HTML5", "CSS3"],
            },
            {
              title: "Frameworks & Libraries",
              skills: ["React", "Next.js", "Node.js", "Express", "Laravel", "Bootstrap", "Tailwind CSS"],
            },
            {
              title: "Databases & Design",
              skills: ["MySQL", "MSSQL", "Figma", "Illustrator", "Photoshop"],
            },
          ].map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 20px 60px rgba(220, 38, 38, 0.4)",
              }}
              className="relative bg-gradient-to-br from-red-950/30 to-black border border-red-600/30 rounded-2xl p-6 backdrop-blur-sm hover:border-red-600 transition-all group overflow-hidden"
            >
              {/* Shine effect on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              </div>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-red-600 mb-4">
                  {category.title}
                </h3>
                <ul className="space-y-3">
                {category.skills.map((skill, skillIndex) => (
                  <li
                    key={skillIndex}
                    className="flex items-center gap-2 text-gray-300"
                  >
                    <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                    <span>{skill}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
