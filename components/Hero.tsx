"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Mail, Sparkles, Zap, Terminal, Briefcase } from "lucide-react";
import Image from "next/image";

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center px-6 pt-24 overflow-hidden"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-red-600/10 via-transparent to-transparent rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-red-600/10 via-transparent to-transparent rounded-full blur-3xl"
        />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl w-full grid md:grid-cols-2 gap-12 items-center relative z-10"
      >
        {/* Left Side - Profile Image */}
        <motion.div variants={itemVariants} className="flex justify-center">
          <div className="relative group">
            {/* Enhanced Glow effect with animation */}
            <motion.div 
              animate={{
                opacity: [0.5, 0.8, 0.5],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-0 bg-gradient-to-r from-red-600 via-red-500 to-red-800 rounded-3xl blur-3xl"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-800 rounded-3xl blur-2xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>

            {/* Image container */}
            <div className="relative w-80 h-80 rounded-3xl overflow-hidden border-4 border-red-600 shadow-2xl shadow-red-600/50">
              <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 to-transparent z-10"></div>
              {/* Profile image */}
              <Image
                src="/2.jpg"
                alt="Ron Hezykiel Arbois"
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Floating badges */}
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -top-4 -right-4 bg-red-600 px-4 py-2 rounded-full shadow-lg"
            >
              <Sparkles className="inline mr-2" size={16} />
              Available
            </motion.div>
          </div>
        </motion.div>

        {/* Right Side - Text Content */}
        <motion.div variants={itemVariants} className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600/10 border border-red-600 rounded-full text-red-500"
          >
            <Zap size={16} />
            <span className="text-sm">Vibe Coding & Full Stack Developer</span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl font-bold leading-tight"
          >
            Ron Hezykiel
            <br />
            <span className="text-red-600">Arbois</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-300 max-w-xl"
          >
            Crafting exceptional digital experiences through clean code and
            innovative solutions. Specialized in building scalable,
            performant, and beautiful web applications.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex gap-4 flex-wrap"
          >
            <motion.a
              href="#projects"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-red-600 hover:bg-red-700 rounded-lg font-semibold shadow-lg shadow-red-600/50 transition-all inline-flex items-center gap-2"
            >
              <Terminal size={20} />
              View My Work
            </motion.a>

            <motion.a
              href="#resume"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 border-2 border-red-600 hover:bg-red-600/10 rounded-lg font-semibold transition-all inline-flex items-center gap-2"
            >
              <Briefcase size={20} />
              View Resume
            </motion.a>
          </motion.div>

          {/* Social Links */}
          <motion.div variants={itemVariants} className="flex gap-4 pt-4">
            {[
              { Icon: Github, href: "https://github.com/rllL1" },
              { Icon: Linkedin, href: "https://www.linkedin.com/in/ron-hezykiel-arbois-5297b9297/" },
              { Icon: Mail, href: "mailto:arboisron2@gmail.com" },
            ].map(({ Icon, href }, index) => (
              <motion.a
                key={index}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                className="w-12 h-12 rounded-full bg-red-600/10 border border-red-600/30 flex items-center justify-center hover:bg-red-600 hover:border-red-600 transition-all"
              >
                <Icon size={20} />
              </motion.a>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
