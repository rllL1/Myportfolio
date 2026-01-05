"use client";

import { useState, useEffect } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, Trash2, Save, X, Award } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Skill {
  id: string;
  name: string;
  category: string;
  icon?: string;
  order_index: number;
}

export default function SkillsManagement() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "Languages",
    icon: "",
  });

  const categories = ["Languages", "Frameworks", "Tools", "Design"];

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const { data, error } = await supabase
        .from("skills")
        .select("*")
        .order("order_index");

      if (error) throw error;
      setSkills(data || []);
    } catch (error) {
      console.error("Error fetching skills:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingSkill(null);
    setFormData({ name: "", category: "Languages", icon: "" });
    setShowModal(true);
  };

  const handleEdit = (skill: Skill) => {
    setEditingSkill(skill);
    setFormData({
      name: skill.name,
      category: skill.category,
      icon: skill.icon || "",
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      if (editingSkill) {
        const { error } = await supabase
          .from("skills")
          .update(formData)
          .eq("id", editingSkill.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("skills").insert({
          ...formData,
          order_index: skills.length,
        });
        if (error) throw error;
      }
      fetchSkills();
      setShowModal(false);
    } catch (error) {
      console.error("Error saving skill:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this skill?")) return;
    try {
      const { error } = await supabase.from("skills").delete().eq("id", id);
      if (error) throw error;
      fetchSkills();
    } catch (error) {
      console.error("Error deleting skill:", error);
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
                <Award className="text-red-600" />
                Skills Management
              </h2>
              <p className="text-gray-400">Manage your technical skills</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAdd}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-lg font-semibold shadow-lg shadow-red-600/50"
            >
              <Plus size={20} />
              Add Skill
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
            <div className="space-y-6">
              {categories.map((category) => (
                <div
                  key={category}
                  className="bg-gradient-to-br from-red-950/30 to-black border border-red-600/30 rounded-xl p-6"
                >
                  <h3 className="text-xl font-bold mb-4 text-red-600">
                    {category}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {skills
                      .filter((skill) => skill.category === category)
                      .map((skill) => (
                        <motion.div
                          key={skill.id}
                          whileHover={{ scale: 1.02 }}
                          className="bg-black/50 border border-red-600/20 rounded-lg p-4 flex items-center justify-between group"
                        >
                          <span className="font-medium">{skill.name}</span>
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleEdit(skill)}
                              className="p-2 hover:bg-red-600/20 rounded-lg transition-colors"
                            >
                              <Edit2 size={16} className="text-blue-400" />
                            </button>
                            <button
                              onClick={() => handleDelete(skill.id)}
                              className="p-2 hover:bg-red-600/20 rounded-lg transition-colors"
                            >
                              <Trash2 size={16} className="text-red-400" />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                  </div>
                </div>
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
              className="bg-gradient-to-br from-red-950/50 to-black border border-red-600/30 rounded-2xl p-8 max-w-md w-full"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">
                  {editingSkill ? "Edit Skill" : "Add Skill"}
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
                    Skill Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full bg-black/50 border border-red-600/30 rounded-lg px-4 py-3 text-white focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/50"
                    placeholder="e.g., JavaScript"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full bg-black/50 border border-red-600/30 rounded-lg px-4 py-3 text-white focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/50"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Icon (optional)
                  </label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) =>
                      setFormData({ ...formData, icon: e.target.value })
                    }
                    className="w-full bg-black/50 border border-red-600/30 rounded-lg px-4 py-3 text-white focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/50"
                    placeholder="Icon name or emoji"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSave}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-lg font-semibold shadow-lg shadow-red-600/50"
                >
                  <Save size={20} />
                  Save
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
