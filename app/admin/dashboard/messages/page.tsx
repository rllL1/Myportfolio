"use client";

import { useState, useEffect } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";
import { motion } from "framer-motion";
import { Mail, Trash2, Eye, MessageSquare } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
  read: boolean;
}

export default function MessagesManagement() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from("contact_messages")
        .update({ read: true })
        .eq("id", id);

      if (error) throw error;
      fetchMessages();
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    try {
      const { error } = await supabase
        .from("contact_messages")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setSelectedMessage(null);
      fetchMessages();
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <MessageSquare className="text-red-600" />
              Contact Messages
            </h2>
            <p className="text-gray-400">
              {messages.filter((m) => !m.read).length} unread messages
            </p>
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Messages List */}
              <div className="lg:col-span-1 space-y-3">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => {
                      setSelectedMessage(message);
                      if (!message.read) handleMarkAsRead(message.id);
                    }}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedMessage?.id === message.id
                        ? "bg-red-600/20 border-red-600"
                        : message.read
                        ? "bg-gradient-to-br from-red-950/20 to-black border-red-600/20"
                        : "bg-gradient-to-br from-red-950/30 to-black border-red-600/40"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Mail size={16} className="text-red-600" />
                        <span className="font-semibold text-sm">
                          {message.name}
                        </span>
                      </div>
                      {!message.read && (
                        <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mb-2">{message.email}</p>
                    <p className="text-sm text-gray-300 line-clamp-2">
                      {message.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      {formatDate(message.created_at)}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Message Detail */}
              <div className="lg:col-span-2">
                {selectedMessage ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-red-950/30 to-black border border-red-600/30 rounded-xl p-8"
                  >
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h3 className="text-2xl font-bold mb-2">
                          {selectedMessage.name}
                        </h3>
                        <a
                          href={`mailto:${selectedMessage.email}`}
                          className="text-red-600 hover:underline flex items-center gap-2"
                        >
                          <Mail size={16} />
                          {selectedMessage.email}
                        </a>
                      </div>
                      <button
                        onClick={() => handleDelete(selectedMessage.id)}
                        className="p-3 hover:bg-red-600/20 rounded-lg transition-colors"
                      >
                        <Trash2 size={20} className="text-red-400" />
                      </button>
                    </div>

                    <div className="mb-6">
                      <p className="text-sm text-gray-400 mb-4">
                        Received: {formatDate(selectedMessage.created_at)}
                      </p>
                      <div className="bg-black/50 border border-red-600/20 rounded-lg p-6">
                        <p className="text-gray-200 whitespace-pre-wrap">
                          {selectedMessage.message}
                        </p>
                      </div>
                    </div>

                    <motion.a
                      href={`mailto:${selectedMessage.email}`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-lg font-semibold shadow-lg shadow-red-600/50 transition-all"
                    >
                      <Mail size={20} />
                      Reply via Email
                    </motion.a>
                  </motion.div>
                ) : (
                  <div className="bg-gradient-to-br from-red-950/20 to-black border border-red-600/20 rounded-xl p-8 flex flex-col items-center justify-center h-full">
                    <Eye size={48} className="text-red-600/50 mb-4" />
                    <p className="text-gray-400">Select a message to view</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
