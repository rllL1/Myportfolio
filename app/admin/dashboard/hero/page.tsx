"use client";

import { useState, useEffect } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";
import { motion } from "framer-motion";
import { Save, Upload, Eye, Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface HeroData {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  cta_text: string;
  cta_link: string;
  image_url: string;
  badges: string[];
}

export default function HeroManagement() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [heroData, setHeroData] = useState<HeroData>({
    id: "",
    title: "",
    subtitle: "",
    description: "",
    cta_text: "",
    cta_link: "",
    image_url: "",
    badges: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchHeroData();
  }, []);

  const fetchHeroData = async () => {
    try {
      const { data, error } = await supabase
        .from("hero_section")
        .select("*")
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error("Error fetching hero data:", error);
        setMessage("Error loading data. Please check your database connection.");
        return;
      }

      if (data) {
        setHeroData(data);
      } else {
        setMessage("No hero data found. Please run the SQL schema first.");
      }
    } catch (error) {
      console.error("Error fetching hero data:", error);
      setMessage("Error loading data");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");

    try {
      const { error } = await supabase
        .from("hero_section")
        .upsert(heroData, { onConflict: "id" });

      if (error) throw error;
      setMessage("Saved successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error saving:", error);
      setMessage("Error saving data");
    } finally {
      setSaving(false);
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
                <Sparkles className="text-red-600" />
                Hero Section
              </h2>
              <p className="text-gray-400">Manage your portfolio hero content</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-lg font-semibold shadow-lg shadow-red-600/50 disabled:opacity-50"
            >
              <Save size={20} />
              {saving ? "Saving..." : "Save Changes"}
            </motion.button>
          </div>

          {/* Success/Error Message */}
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-6 p-4 rounded-lg ${
                message.includes("Error")
                  ? "bg-red-600/20 border border-red-600/50 text-red-400"
                  : "bg-green-600/20 border border-green-600/50 text-green-400"
              }`}
            >
              {message}
            </motion.div>
          )}

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
              {/* Title */}
              <div className="bg-gradient-to-br from-red-950/30 to-black border border-red-600/30 rounded-xl p-6">
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={heroData.title}
                  onChange={(e) =>
                    setHeroData({ ...heroData, title: e.target.value })
                  }
                  className="w-full bg-black/50 border border-red-600/30 rounded-lg px-4 py-3 text-white focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/50"
                  placeholder="Hi, I'm Ron Hezykiel Arbois"
                />
              </div>

              {/* Subtitle */}
              <div className="bg-gradient-to-br from-red-950/30 to-black border border-red-600/30 rounded-xl p-6">
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={heroData.subtitle}
                  onChange={(e) =>
                    setHeroData({ ...heroData, subtitle: e.target.value })
                  }
                  className="w-full bg-black/50 border border-red-600/30 rounded-lg px-4 py-3 text-white focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/50"
                  placeholder="Software Engineer"
                />
              </div>

              {/* Description */}
              <div className="bg-gradient-to-br from-red-950/30 to-black border border-red-600/30 rounded-xl p-6">
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={heroData.description}
                  onChange={(e) =>
                    setHeroData({ ...heroData, description: e.target.value })
                  }
                  rows={4}
                  className="w-full bg-black/50 border border-red-600/30 rounded-lg px-4 py-3 text-white focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/50"
                  placeholder="Your description..."
                />
              </div>

              {/* CTA Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-red-950/30 to-black border border-red-600/30 rounded-xl p-6">
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    CTA Button Text
                  </label>
                  <input
                    type="text"
                    value={heroData.cta_text}
                    onChange={(e) =>
                      setHeroData({ ...heroData, cta_text: e.target.value })
                    }
                    className="w-full bg-black/50 border border-red-600/30 rounded-lg px-4 py-3 text-white focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/50"
                    placeholder="View My Work"
                  />
                </div>

                <div className="bg-gradient-to-br from-red-950/30 to-black border border-red-600/30 rounded-xl p-6">
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    CTA Link
                  </label>
                  <input
                    type="text"
                    value={heroData.cta_link}
                    onChange={(e) =>
                      setHeroData({ ...heroData, cta_link: e.target.value })
                    }
                    className="w-full bg-black/50 border border-red-600/30 rounded-lg px-4 py-3 text-white focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/50"
                    placeholder="#projects"
                  />
                </div>
              </div>

              {/* Image URL */}
              <div className="bg-gradient-to-br from-red-950/30 to-black border border-red-600/30 rounded-xl p-6">
                <label className="block text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                  <Upload size={18} className="text-red-600" />
                  Profile Image URL
                </label>
                <input
                  type="text"
                  value={heroData.image_url}
                  onChange={(e) =>
                    setHeroData({ ...heroData, image_url: e.target.value })
                  }
                  className="w-full bg-black/50 border border-red-600/30 rounded-lg px-4 py-3 text-white focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/50"
                  placeholder="/2.jpg"
                />
              </div>

              {/* Badges */}
              <div className="bg-gradient-to-br from-red-950/30 to-black border border-red-600/30 rounded-xl p-6">
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Badges (comma-separated)
                </label>
                <input
                  type="text"
                  value={heroData.badges?.join(", ") || ""}
                  onChange={(e) =>
                    setHeroData({
                      ...heroData,
                      badges: e.target.value.split(",").map((b) => b.trim()),
                    })
                  }
                  className="w-full bg-black/50 border border-red-600/30 rounded-lg px-4 py-3 text-white focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/50"
                  placeholder="Available for Hire, Open Source Enthusiast"
                />
              </div>

              {/* Preview Button */}
              <motion.a
                href="/"
                target="_blank"
                whileHover={{ scale: 1.02 }}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-red-950/30 hover:bg-red-950/50 border border-red-600/30 hover:border-red-600 rounded-lg font-semibold transition-all"
              >
                <Eye size={20} />
                Preview Live Site
              </motion.a>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
