"use client";

import { useState, useEffect } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, Trash2, Save, X, Briefcase } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface TimelineItem {
  id: string;
  title: string;
  organization: string;
  description?: string;
  start_date: string;
  end_date?: string;
  type: "work" | "education";
  order_index: number;
}

export default function TimelineManagement() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<TimelineItem | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    organization: "",
    description: "",
    start_date: "",
    end_date: "",
    type: "work" as "work" | "education",
  });

  useEffect(() => {
    fetchTimeline();
  }, []);

  const fetchTimeline = async () => {
    try {
      const { data, error } = await supabase
        .from("timeline_items")
        .select("*")
        .order("order_index");

      if (error) throw error;
      setTimeline(data || []);
    } catch (error) {
      console.error("Error fetching timeline:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({
      title: "",
      organization: "",
      description: "",
      start_date: "",
      end_date: "",
      type: "work",
    });
    setShowModal(true);
  };

  const handleEdit = (item: TimelineItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      organization: item.organization,
      description: item.description || "",
      start_date: item.start_date,
      end_date: item.end_date || "",
      type: item.type,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      const itemData = {
        ...formData,
        end_date: formData.end_date || null,
        description: formData.description || null,
      };

      if (editingItem) {
        const { error } = await supabase
          .from("timeline_items")
          .update(itemData)
          .eq("id", editingItem.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("timeline_items").insert({
          ...itemData,
          order_index: timeline.length,
        });
        if (error) throw error;
      }
      fetchTimeline();
      setShowModal(false);
    } catch (error) {
      console.error("Error saving timeline item:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this timeline item?")) return;
    try {
      const { error } = await supabase
        .from("timeline_items")
        .delete()
        .eq("id", id);
      if (error) throw error;
      fetchTimeline();
    } catch (error) {
      console.error("Error deleting timeline item:", error);
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
                <Briefcase className="text-red-600" />
                Resume & Timeline
              </h2>
              <p className="text-gray-400">Manage work experience and education</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAdd}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-lg font-semibold shadow-lg shadow-red-600/50"
            >
              <Plus size={20} />
              Add Item
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
            <div className="space-y-4">
              {timeline.map((item) => (
                <motion.div
                  key={item.id}
                  whileHover={{ scale: 1.01 }}
                  className="bg-gradient-to-br from-red-950/30 to-black border border-red-600/30 rounded-xl p-6 group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded-full ${
                            item.type === "work"
                              ? "bg-blue-600/20 text-blue-400 border border-blue-600/30"
                              : "bg-green-600/20 text-green-400 border border-green-600/30"
                          }`}
                        >
                          {item.type === "work" ? "Work" : "Education"}
                        </span>
                        <span className="text-sm text-gray-400">
                          {item.start_date} - {item.end_date || "Present"}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold mb-1">{item.title}</h3>
                      <p className="text-red-600 font-semibold mb-2">
                        {item.organization}
                      </p>
                      {item.description && (
                        <p className="text-gray-400 text-sm">
                          {item.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-2 hover:bg-red-600/20 rounded-lg transition-colors"
                      >
                        <Edit2 size={18} className="text-blue-400" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 hover:bg-red-600/20 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} className="text-red-400" />
                      </button>
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
                  {editingItem ? "Edit Timeline Item" : "Add Timeline Item"}
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
                    Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        type: e.target.value as "work" | "education",
                      })
                    }
                    className="w-full bg-black/50 border border-red-600/30 rounded-lg px-4 py-3 text-white focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/50"
                  >
                    <option value="work">Work Experience</option>
                    <option value="education">Education</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Title/Position
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full bg-black/50 border border-red-600/30 rounded-lg px-4 py-3 text-white focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/50"
                    placeholder="Frontend Developer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Organization/Institution
                  </label>
                  <input
                    type="text"
                    value={formData.organization}
                    onChange={(e) =>
                      setFormData({ ...formData, organization: e.target.value })
                    }
                    className="w-full bg-black/50 border border-red-600/30 rounded-lg px-4 py-3 text-white focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/50"
                    placeholder="Company Name"
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
                    placeholder="Brief description..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Start Date
                    </label>
                    <input
                      type="text"
                      value={formData.start_date}
                      onChange={(e) =>
                        setFormData({ ...formData, start_date: e.target.value })
                      }
                      className="w-full bg-black/50 border border-red-600/30 rounded-lg px-4 py-3 text-white focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/50"
                      placeholder="2024"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      End Date (or leave empty for Present)
                    </label>
                    <input
                      type="text"
                      value={formData.end_date}
                      onChange={(e) =>
                        setFormData({ ...formData, end_date: e.target.value })
                      }
                      className="w-full bg-black/50 border border-red-600/30 rounded-lg px-4 py-3 text-white focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/50"
                      placeholder="2026 or leave empty"
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
