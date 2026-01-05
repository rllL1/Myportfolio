"use client";

import { useState, useEffect } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";
import { motion } from "framer-motion";
import { MessageSquare, Send, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface ChatMessage {
  id: string;
  sender_name: string;
  sender_email?: string;
  message: string;
  is_admin: boolean;
  created_at: string;
}

export default function LiveChatManagement() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    fetchMessages();
    // Set up real-time subscription
    const subscription = supabase
      .channel("chat_messages")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "chat_messages" },
        () => {
          fetchMessages();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from("chat_messages")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendReply = async () => {
    if (!replyText.trim()) return;

    try {
      const { error } = await supabase.from("chat_messages").insert({
        sender_name: "Admin",
        message: replyText,
        is_admin: true,
      });

      if (error) throw error;
      setReplyText("");
      fetchMessages();
    } catch (error) {
      console.error("Error sending reply:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    try {
      const { error } = await supabase
        .from("chat_messages")
        .delete()
        .eq("id", id);

      if (error) throw error;
      fetchMessages();
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
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

        <main className="flex-1 p-6 overflow-hidden flex flex-col">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <MessageSquare className="text-red-600" />
              Live Chat
            </h2>
            <p className="text-gray-400">
              Real-time chat with website visitors
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center flex-1">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full"
              />
            </div>
          ) : (
            <div className="flex-1 flex flex-col bg-gradient-to-br from-red-950/20 to-black border border-red-600/30 rounded-xl overflow-hidden">
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${
                      message.is_admin ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[70%] ${
                        message.is_admin ? "items-end" : "items-start"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-gray-400">
                          {message.sender_name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatTime(message.created_at)}
                        </span>
                        {message.is_admin && (
                          <button
                            onClick={() => handleDelete(message.id)}
                            className="opacity-0 hover:opacity-100 transition-opacity"
                          >
                            <Trash2 size={12} className="text-red-400" />
                          </button>
                        )}
                      </div>
                      <div
                        className={`px-4 py-3 rounded-2xl ${
                          message.is_admin
                            ? "bg-gradient-to-r from-red-600 to-red-700 text-white"
                            : "bg-red-950/30 border border-red-600/30"
                        }`}
                      >
                        <p className="text-sm">{message.message}</p>
                      </div>
                      {message.sender_email && (
                        <p className="text-xs text-gray-500 mt-1">
                          {message.sender_email}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Reply Input */}
              <div className="p-6 border-t border-red-600/30 bg-black/50">
                <div className="flex items-end gap-3">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendReply();
                      }
                    }}
                    placeholder="Type your reply..."
                    rows={3}
                    className="flex-1 bg-red-950/20 border border-red-600/30 rounded-lg px-4 py-3 text-white focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/50 resize-none"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSendReply}
                    className="p-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-lg shadow-lg shadow-red-600/50 transition-all"
                  >
                    <Send size={20} />
                  </motion.button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Press Enter to send, Shift+Enter for new line
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
