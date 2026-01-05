"use client";

import { useState, useEffect } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";
import { motion } from "framer-motion";
import { Settings as SettingsIcon, Save, Loader, Globe, FileText, Link as LinkIcon } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface SiteSettings {
  id: string;
  site_title: string;
  site_description: string;
  meta_keywords: string;
  footer_text: string;
  resume_pdf_url: string;
}

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string;
  display_order: number;
}

export default function SettingsManagement() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [formData, setFormData] = useState({
    site_title: "",
    site_description: "",
    meta_keywords: "",
    footer_text: "",
    resume_pdf_url: "",
  });

  useEffect(() => {
    fetchSettings();
    fetchSocialLinks();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error("Error fetching settings:", error);
        return;
      }

      if (data) {
        setSettings(data);
        setFormData({
          site_title: data.site_title,
          site_description: data.site_description,
          meta_keywords: data.meta_keywords,
          footer_text: data.footer_text,
          resume_pdf_url: data.resume_pdf_url,
        });
      } else {
        // No settings exist yet - use defaults
        console.log("No settings found. Please run the SQL schema to create initial data.");
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSocialLinks = async () => {
    try {
      const { data, error } = await supabase
        .from("social_links")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      setSocialLinks(data || []);
    } catch (error) {
      console.error("Error fetching social links:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { error } = await supabase
        .from("site_settings")
        .update(formData)
        .eq("id", settings?.id);

      if (error) throw error;

      alert("Settings updated successfully!");
      fetchSettings();
    } catch (error) {
      console.error("Error updating settings:", error);
      alert("Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  const updateSocialLink = async (id: string, url: string) => {
    try {
      const { error } = await supabase
        .from("social_links")
        .update({ url })
        .eq("id", id);

      if (error) throw error;
      alert("Social link updated!");
      fetchSocialLinks();
    } catch (error) {
      console.error("Error updating social link:", error);
      alert("Failed to update social link");
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
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <SettingsIcon className="text-red-600" size={32} />
                <h2 className="text-3xl font-bold">Site Settings</h2>
              </div>
              <p className="text-gray-400">Manage your portfolio site configuration</p>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader className="animate-spin text-red-600" size={48} />
              </div>
            ) : (
              <div className="space-y-8">
                {/* General Settings */}
                <motion.form
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  onSubmit={handleSubmit}
                  className="bg-gradient-to-br from-red-950/20 to-black border border-red-600/30 rounded-2xl p-8 space-y-6"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <Globe className="text-red-600" size={24} />
                    <h3 className="text-2xl font-bold">General Settings</h3>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Site Title
                    </label>
                    <input
                      type="text"
                      value={formData.site_title}
                      onChange={(e) => setFormData({ ...formData, site_title: e.target.value })}
                      className="w-full bg-black/50 border border-red-600/30 rounded-lg px-4 py-3 text-white focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/50"
                      placeholder="Ron Arbois - Portfolio"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Site Description
                    </label>
                    <textarea
                      value={formData.site_description}
                      onChange={(e) => setFormData({ ...formData, site_description: e.target.value })}
                      rows={3}
                      className="w-full bg-black/50 border border-red-600/30 rounded-lg px-4 py-3 text-white focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/50"
                      placeholder="Professional portfolio website..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Meta Keywords (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={formData.meta_keywords}
                      onChange={(e) => setFormData({ ...formData, meta_keywords: e.target.value })}
                      className="w-full bg-black/50 border border-red-600/30 rounded-lg px-4 py-3 text-white focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/50"
                      placeholder="portfolio, developer, web development"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Footer Text
                    </label>
                    <input
                      type="text"
                      value={formData.footer_text}
                      onChange={(e) => setFormData({ ...formData, footer_text: e.target.value })}
                      className="w-full bg-black/50 border border-red-600/30 rounded-lg px-4 py-3 text-white focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/50"
                      placeholder="© 2026 Ron Arbois. All rights reserved."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                      <FileText size={16} className="text-red-600" />
                      Resume PDF URL
                    </label>
                    <input
                      type="text"
                      value={formData.resume_pdf_url}
                      onChange={(e) => setFormData({ ...formData, resume_pdf_url: e.target.value })}
                      className="w-full bg-black/50 border border-red-600/30 rounded-lg px-4 py-3 text-white focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/50"
                      placeholder="/resume.pdf"
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={saving}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-3 rounded-lg shadow-lg shadow-red-600/50 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {saving ? (
                      <>
                        <Loader className="animate-spin" size={20} />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={20} />
                        Save Settings
                      </>
                    )}
                  </motion.button>
                </motion.form>

                {/* Social Links */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-gradient-to-br from-red-950/20 to-black border border-red-600/30 rounded-2xl p-8"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <LinkIcon className="text-red-600" size={24} />
                    <h3 className="text-2xl font-bold">Social Links</h3>
                  </div>

                  <div className="space-y-4">
                    {socialLinks.map((link) => (
                      <div key={link.id} className="flex items-center gap-4">
                        <div className="w-32">
                          <label className="text-sm font-medium text-gray-300 capitalize">
                            {link.platform}
                          </label>
                        </div>
                        <input
                          type="url"
                          defaultValue={link.url}
                          onBlur={(e) => {
                            if (e.target.value !== link.url) {
                              updateSocialLink(link.id, e.target.value);
                            }
                          }}
                          className="flex-1 bg-black/50 border border-red-600/30 rounded-lg px-4 py-3 text-white focus:border-red-600 focus:outline-none"
                          placeholder={`https://${link.platform}.com/...`}
                        />
                      </div>
                    ))}
                  </div>

                  {socialLinks.length === 0 && (
                    <p className="text-gray-400 text-center py-4">
                      No social links configured. Add them in the database.
                    </p>
                  )}
                </motion.div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
