"use client";

import { useState, useEffect } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";
import { motion } from "framer-motion";
import {
  FolderKanban,
  MessageSquare,
  Eye,
  Award,
  Loader,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

interface Stats {
  projects: number;
  skills: number;
  messages: number;
  unreadMessages: number;
}

interface RecentMessage {
  id: string;
  name: string;
  message: string;
  created_at: string;
  is_read: boolean;
}

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    projects: 0,
    skills: 0,
    messages: 0,
    unreadMessages: 0,
  });
  const [recentMessages, setRecentMessages] = useState<RecentMessage[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch projects count
      const { count: projectsCount } = await supabase
        .from("projects")
        .select("*", { count: "exact", head: true });

      // Fetch skills count
      const { count: skillsCount } = await supabase
        .from("skills")
        .select("*", { count: "exact", head: true });

      // Fetch messages count
      const { count: messagesCount } = await supabase
        .from("contact_messages")
        .select("*", { count: "exact", head: true });

      // Fetch unread messages count
      const { count: unreadCount } = await supabase
        .from("contact_messages")
        .select("*", { count: "exact", head: true })
        .eq("is_read", false);

      // Fetch recent messages
      const { data: messages } = await supabase
        .from("contact_messages")
        .select("id, name, message, created_at, is_read")
        .order("created_at", { ascending: false })
        .limit(3);

      setStats({
        projects: projectsCount || 0,
        skills: skillsCount || 0,
        messages: messagesCount || 0,
        unreadMessages: unreadCount || 0,
      });

      setRecentMessages(messages || []);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return "just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hour${Math.floor(seconds / 3600) > 1 ? "s" : ""} ago`;
    return `${Math.floor(seconds / 86400)} day${Math.floor(seconds / 86400) > 1 ? "s" : ""} ago`;
  };

  const statsDisplay = [
    { label: "Total Projects", value: stats.projects.toString(), icon: FolderKanban, change: "+2", color: "red" },
    { label: "Skills", value: stats.skills.toString(), icon: Award, change: "+3", color: "blue" },
    { label: "Messages", value: stats.messages.toString(), icon: MessageSquare, change: `${stats.unreadMessages} new`, color: "green" },
    { label: "Page Views", value: "1.2k", icon: Eye, change: "+12%", color: "purple" },
  ];

  return (
    <div className="flex min-h-screen bg-black text-white">
      <AdminSidebar
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex-1 flex flex-col">
        <AdminTopbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 p-6 overflow-y-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Dashboard Overview</h2>
            <p className="text-gray-400">Monitor your portfolio performance</p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader className="animate-spin text-red-600" size={48} />
            </div>
          ) : (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statsDisplay.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-gradient-to-br from-red-950/30 to-black border border-red-600/30 rounded-xl p-6 backdrop-blur-sm"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-red-600/20 rounded-lg">
                      <Icon className="text-red-600" size={24} />
                    </div>
                    <span className="text-green-400 text-sm font-semibold bg-green-400/10 px-2 py-1 rounded">
                      {stat.change}
                    </span>
              </div>

                      <p className="text-gray-400 text-sm">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gradient-to-br from-red-950/30 to-black border border-red-600/30 rounded-xl p-6"
            >
              <h3 className="text-xl font-bold mb-4 text-red-600">Quick Actions</h3>
              <div className="space-y-3">
                {[
                  { label: "Add New Project", href: "/admin/dashboard/projects" },
                  { label: "Update Skills", href: "/admin/dashboard/skills" },
                  { label: "Edit Hero Section", href: "/admin/dashboard/hero" },
                  { label: "View Messages", href: "/admin/dashboard/messages" },
                ].map((action, idx) => (
                  <Link key={idx} href={action.href}>
                    <motion.button
                      whileHover={{ x: 10, scale: 1.02 }}
                      className="w-full text-left px-4 py-3 bg-black/50 hover:bg-red-600/20 border border-red-600/20 hover:border-red-600 rounded-lg transition-all text-white"
                    >
                      {action.label}
                    </motion.button>
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* Recent Messages */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gradient-to-br from-red-950/30 to-black border border-red-600/30 rounded-xl p-6"
            >
              <h3 className="text-xl font-bold mb-4 text-red-600">Recent Messages</h3>
              <div className="space-y-4">
                {recentMessages.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">No messages yet</p>
                ) : (
                  recentMessages.map((msg) => (
                    <Link key={msg.id} href="/admin/dashboard/messages">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="p-4 bg-black/50 rounded-lg border border-red-600/20 hover:border-red-600/50 transition-all cursor-pointer"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-white flex items-center gap-2">
                            {msg.name}
                            {!msg.is_read && (
                              <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                            )}
                          </h4>
                          <span className="text-xs text-gray-400">
                            {formatTimeAgo(msg.created_at)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400 line-clamp-2">{msg.message}</p>
                      </motion.div>
                    </Link>
                  ))
                )}
              </div>
            </motion.div>
          </div>

          {/* Activity Chart Placeholder */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 bg-gradient-to-br from-red-950/30 to-black border border-red-600/30 rounded-xl p-6"
          >
            <h3 className="text-xl font-bold mb-4 text-red-600">Activity Overview</h3>
            <div className="h-64 flex items-center justify-center text-gray-400">
              <p>Chart visualization will be displayed here</p>
            </div>
          </motion.div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
