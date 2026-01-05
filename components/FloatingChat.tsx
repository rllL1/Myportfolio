"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Minimize2, Maximize2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Message {
  id: string;
  text: string;
  sender: "user" | "admin";
  timestamp: Date;
}

export default function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState("");
  const [isAdminOnline, setIsAdminOnline] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi! 👋 Welcome to my portfolio. How can I help you today?",
      sender: "admin",
      timestamp: new Date(),
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const checkAdminOnlineStatus = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAdminOnline(!!session);
    } catch (error) {
      console.error("Error checking admin status:", error);
      setIsAdminOnline(false);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Check immediately and every 30 seconds
    const interval = setInterval(checkAdminOnlineStatus, 30000);
    // Initial check happens after a minimal delay
    const timeout = setTimeout(checkAdminOnlineStatus, 0);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  const handleSendMessage = async () => {
    if (message.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: message,
        sender: "user",
        timestamp: new Date(),
      };
      setMessages([...messages, newMessage]);
      const userQuestion = message;
      setMessage("");

      // Save to database
      try {
        await supabase.from("chat_messages").insert([
          {
            sender_name: "Visitor",
            message: newMessage.text,
            is_admin: false,
          },
        ]);
      } catch (error) {
        console.error("Error saving message:", error);
      }

      // Get AI response if admin is offline
      if (!isAdminOnline) {
        // Show typing indicator
        const typingMessage: Message = {
          id: "typing",
          text: "AI is typing...",
          sender: "admin",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, typingMessage]);

        try {
          const response = await fetch("/api/chat", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ message: userQuestion }),
          });

          // Remove typing indicator
          setMessages((prev) => prev.filter((msg) => msg.id !== "typing"));

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to get AI response");
          }

          const data = await response.json();

          if (data.reply) {
            const aiReply: Message = {
              id: (Date.now() + 1).toString(),
              text: data.reply,
              sender: "admin",
              timestamp: new Date(),
            };
            setMessages((prev) => [...prev, aiReply]);

            // Save AI reply to database
            await supabase.from("chat_messages").insert([
              {
                sender_name: "AI Assistant",
                message: aiReply.text,
                is_admin: true,
              },
            ]);
          } else {
            throw new Error("No reply from AI");
          }
        } catch (error) {
          console.error("Error getting AI response:", error);
          
          // Remove typing indicator
          setMessages((prev) => prev.filter((msg) => msg.id !== "typing"));

          // Fallback message
          const fallbackReply: Message = {
            id: (Date.now() + 1).toString(),
            text: "Thanks for reaching out! I'm currently offline, but I'll get back to you as soon as possible. You can also reach me at arboisron2@gmail.com for urgent matters. 📧",
            sender: "admin",
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, fallbackReply]);

          await supabase.from("chat_messages").insert([
            {
              sender_name: "Auto Reply",
              message: fallbackReply.text,
              is_admin: true,
            },
          ]);
        }
      }
    }
  };

  return (
    <>
      {/* Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-r from-red-600 to-red-700 rounded-full shadow-2xl shadow-red-600/50 flex items-center justify-center text-white hover:shadow-red-600/70 transition-all"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <MessageCircle size={28} />
            </motion.div>
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 border-2 border-black rounded-full animate-pulse"></span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className={`fixed ${
              isMinimized ? "bottom-6 right-6 w-80" : "bottom-6 right-6 w-96"
            } z-50 flex flex-col bg-black border-2 border-red-600/50 rounded-2xl shadow-2xl shadow-red-600/30 overflow-hidden transition-all`}
            style={{ maxHeight: isMinimized ? "60px" : "600px" }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white font-bold">
                    RA
                  </div>
                  <span className={`absolute bottom-0 right-0 w-3 h-3 ${
                    isAdminOnline ? "bg-green-500" : "bg-gray-500"
                  } border-2 border-red-600 rounded-full`}></span>
                </div>
                <div>
                  <h3 className="font-bold text-white">Ron Arbois</h3>
                  <p className="text-xs text-red-100">
                    {isAdminOnline ? "Online • Replies quickly" : "Offline • Will reply soon"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="text-white hover:text-red-100 transition-colors"
                >
                  {isMinimized ? <Maximize2 size={20} /> : <Minimize2 size={20} />}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:text-red-100 transition-colors"
                >
                  <X size={20} />
                </motion.button>
              </div>
            </div>

            {/* Messages Area */}
            {!isMinimized && (
              <>
                <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-gradient-to-b from-[#0a0a0a] to-black">
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${
                        msg.sender === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                          msg.sender === "user"
                            ? "bg-gradient-to-r from-red-600 to-red-700 text-white"
                            : msg.id === "typing"
                            ? "bg-red-950/30 border border-red-600/30 text-gray-400 italic"
                            : "bg-red-950/30 border border-red-600/30 text-white"
                        }`}
                      >
                        <p className="text-sm">{msg.text}</p>
                        {msg.id !== "typing" && (
                          <p className="text-xs opacity-70 mt-1">
                            {msg.timestamp.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-black border-t border-red-600/30">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                      placeholder="Type your message..."
                      className="flex-1 bg-red-950/20 border border-red-600/30 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/50"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSendMessage}
                      className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white p-3 rounded-lg transition-all"
                    >
                      <Send size={20} />
                    </motion.button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
