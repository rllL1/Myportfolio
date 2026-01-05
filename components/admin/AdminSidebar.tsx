"use client";

import { motion } from "framer-motion";
import {
  LayoutDashboard,
  FolderKanban,
  MessageSquare,
  Settings,
  LogOut,
  X,
  Briefcase,
  Award,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export default function AdminSidebar({ isOpen, toggleSidebar }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push("/admin");
    } catch (error) {
      console.error("Error logging out:", error);
      alert("Failed to logout");
    }
  };

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/admin/dashboard",
    },
    {
      id: "hero",
      label: "Hero Section",
      icon: Users,
      href: "/admin/dashboard/hero",
    },
    {
      id: "skills",
      label: "Skills",
      icon: Award,
      href: "/admin/dashboard/skills",
    },
    {
      id: "projects",
      label: "Projects",
      icon: FolderKanban,
      href: "/admin/dashboard/projects",
    },
    {
      id: "timeline",
      label: "Resume/Timeline",
      icon: Briefcase,
      href: "/admin/dashboard/timeline",
    },
    {
      id: "chat",
      label: "Messages",
      icon: MessageSquare,
      href: "/admin/dashboard/chat",
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      href: "/admin/dashboard/settings",
    },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full w-72 bg-gradient-to-b from-black to-red-950/20 border-r border-red-600/30 z-50 transition-transform duration-300 lg:relative lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo/Header */}
          <div className="p-6 border-b border-red-600/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-red-600 to-red-700 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">R</span>
                </div>
                <div>
                  <h2 className="text-white font-bold text-lg">Admin Panel</h2>
                  <p className="text-gray-400 text-xs">Portfolio CMS</p>
                </div>
              </div>
              <button
                onClick={toggleSidebar}
                className="lg:hidden text-gray-400 hover:text-red-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link key={item.id} href={item.href}>
                  <motion.div
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center justify-between px-4 py-3 rounded-lg transition-all cursor-pointer group ${
                      isActive
                        ? "bg-red-600 text-white shadow-lg shadow-red-600/50"
                        : "text-gray-300 hover:bg-red-600/20 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        size={20}
                        className={isActive ? "text-white" : "text-red-600"}
                      />
                      <span className="font-medium">{item.label}</span>
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </nav>

          {/* User Profile & Logout */}
          <div className="p-4 border-t border-red-600/30">
            <div className="flex items-center gap-3 p-3 bg-red-950/30 rounded-lg mb-2">
              <div className="w-10 h-10 bg-gradient-to-r from-red-600 to-red-700 rounded-full flex items-center justify-center text-white font-bold">
                RA
              </div>
              <div className="flex-1">
                <p className="text-white font-medium text-sm">Ron Arbois</p>
                <p className="text-gray-400 text-xs">Administrator</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white rounded-lg transition-all"
            >
              <LogOut size={18} />
              <span className="font-medium">Logout</span>
            </motion.button>
          </div>
        </div>
      </aside>
    </>
  );
}
