"use client";

import { useState, useEffect } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, Trash2, Save, X, FolderKanban, ExternalLink } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";

interface Project {
  id: string;
  title: string;
  description: string;
  tech_stack: string[];
  github_url?: string;
  live_url?: string;
  image_url?: string;
  order_index: number;
}

export default function ProjectsManagement() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tech_stack: "",
    github_url: "",
    live_url: "",
    image_url: "",
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("order_index");

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingProject(null);
    setFormData({
      title: "",
      description: "",
      tech_stack: "",
      github_url: "",
      live_url: "",
      image_url: "",
    });
    setShowModal(true);
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      tech_stack: project.tech_stack.join(", "),
      github_url: project.github_url || "",
      live_url: project.live_url || "",
      image_url: project.image_url || "",
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      const projectData = {
        title: formData.title,
        description: formData.description,
        tech_stack: formData.tech_stack.split(",").map((t) => t.trim()),
        github_url: formData.github_url || null,
        live_url: formData.live_url || null,
        image_url: formData.image_url || null,
      };

      if (editingProject) {
        const { error } = await supabase
          .from("projects")
          .update(projectData)
          .eq("id", editingProject.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("projects").insert({
          ...projectData,
          order_index: projects.length,
        });
        if (error) throw error;
      }
      fetchProjects();
      setShowModal(false);
    } catch (error) {
      console.error("Error saving project:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    try {
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (error) throw error;
      fetchProjects();
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-black text-white">
      <AdminSidebar
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex-1 flex flex-col">
        <AdminTopbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 p-6 overflow-y-auto">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
                <FolderKanban className="text-red-600" />
                Projects Management
              </h2>
              <p className="text-gray-400">Manage your portfolio projects</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAdd}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-lg font-semibold shadow-lg shadow-red-600/50"
            >
              <Plus size={20} />
              Add Project
            </motion.button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full"
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {projects.map((project) => (
                <motion.div
                  key={project.id}
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-br from-red-950/30 to-black border border-red-600/30 rounded-xl overflow-hidden group"
                >
                  {project.image_url && (
                    <div className="relative h-48 bg-gradient-to-br from-red-950/20 to-black">
                      <Image
                        src={project.image_url}
                        alt={project.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-bold">{project.title}</h3>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEdit(project)}
                          className="p-2 hover:bg-red-600/20 rounded-lg transition-colors"
                        >
                          <Edit2 size={16} className="text-blue-400" />
                        </button>
                        <button
                          onClick={() => handleDelete(project.id)}
                          className="p-2 hover:bg-red-600/20 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} className="text-red-400" />
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm mb-4">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tech_stack.map((tech, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-red-600/20 border border-red-600/30 rounded-full text-xs"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-3">
                      {project.github_url && (
                        <a
                          href={project.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-gray-400 hover:text-red-600 flex items-center gap-1 transition-colors"
                        >
                          <ExternalLink size={14} />
                          GitHub
                        </a>
                      )}
                      {project.live_url && (
                        <a
                          href={project.live_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-gray-400 hover:text-red-600 flex items-center gap-1 transition-colors"
                        >
                          <ExternalLink size={14} />
                          Live Demo
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-red-950/50 to-black border border-red-600/30 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">
                  {editingProject ? "Edit Project" : "Add Project"}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-red-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Project Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full bg-black/50 border border-red-600/30 rounded-lg px-4 py-3 text-white focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/50"
                    placeholder="Online Enrollment System"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={3}
                    className="w-full bg-black/50 border border-red-600/30 rounded-lg px-4 py-3 text-white focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/50"
                    placeholder="Project description..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Tech Stack (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.tech_stack}
                    onChange={(e) =>
                      setFormData({ ...formData, tech_stack: e.target.value })
                    }
                    className="w-full bg-black/50 border border-red-600/30 rounded-lg px-4 py-3 text-white focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/50"
                    placeholder="React, Node.js, MongoDB"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Image URL
                  </label>
                  <input
                    type="text"
                    value={formData.image_url}
                    onChange={(e) =>
                      setFormData({ ...formData, image_url: e.target.value })
                    }
                    className="w-full bg-black/50 border border-red-600/30 rounded-lg px-4 py-3 text-white focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/50"
                    placeholder="/1.png"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      GitHub URL
                    </label>
                    <input
                      type="text"
                      value={formData.github_url}
                      onChange={(e) =>
                        setFormData({ ...formData, github_url: e.target.value })
                      }
                      className="w-full bg-black/50 border border-red-600/30 rounded-lg px-4 py-3 text-white focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/50"
                      placeholder="https://github.com/..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Live URL
                    </label>
                    <input
                      type="text"
                      value={formData.live_url}
                      onChange={(e) =>
                        setFormData({ ...formData, live_url: e.target.value })
                      }
                      className="w-full bg-black/50 border border-red-600/30 rounded-lg px-4 py-3 text-white focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/50"
                      placeholder="https://project.com"
                    />
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSave}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-lg font-semibold shadow-lg shadow-red-600/50"
                >
                  <Save size={20} />
                  Save Project
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
