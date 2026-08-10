'use client';

import { Bell, Search, PanelLeft, PanelLeftClose, Menu, LogOut } from 'lucide-react';
import { useSidebar } from './SidebarContext';
import { useRouter } from 'next/navigation';

export default function AdminHeader() {
  const { isCollapsed, toggleSidebar, toggleMobileSidebar } = useSidebar();
  const router = useRouter();

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('adminToken');
      localStorage.removeItem('user');
    }
    router.push('/admin/login');
  };

  return (
    <header className="h-14 bg-white/90 backdrop-blur-md border-b border-stone-200/80 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs font-sans">
      {/* Left Section: Toggle Buttons & Brand Accent */}
      <div className="flex items-center gap-3">
        {/* Mobile Drawer Trigger */}
        <button
          onClick={toggleMobileSidebar}
          title="Open Mobile Navigation"
          className="lg:hidden p-1.5 rounded-xl text-stone-700 hover:bg-stone-100 transition"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Center Section: Global Search Bar */}
      <div className="hidden md:flex flex-1 max-w-sm mx-6 items-center bg-stone-50 rounded-xl px-3.5 py-1.5 gap-2 border border-stone-200/80 focus-within:border-yellow-400 focus-within:bg-white transition shadow-2xs">
        <Search className="w-4 h-4 text-stone-400 flex-shrink-0" />
        <input
          type="text"
          placeholder="Search products, orders, categories..."
          className="bg-transparent text-xs text-stone-800 placeholder-stone-400 outline-none w-full font-medium"
        />
      </div>

      {/* Right Section: Status, Notifications & Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Live API Status Pill */}
        <div className="hidden sm:flex items-center gap-1.5 bg-emerald-50 text-emerald-900 border border-emerald-200 px-2.5 py-1 rounded-full text-[10px] font-extrabold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
          API Live
        </div>

        {/* Notification Bell */}
        <button className="relative w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 transition">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
        </button>

        {/* Admin Profile */}
        <div className="flex items-center gap-2 pl-2 border-l border-stone-200">
          <div className="w-8 h-8 rounded-full bg-stone-950 text-yellow-400 font-black flex items-center justify-center text-xs shadow-xs">
            AD
          </div>
          <div className="hidden sm:block text-left leading-tight">
            <p className="text-xs font-extrabold text-stone-900">Admin</p>
            <p className="text-[10px] text-stone-400 font-medium">Super Admin</p>
          </div>
          <button
            onClick={handleLogout}
            title="Sign Out"
            className="ml-1 p-1.5 rounded-xl hover:bg-red-50 text-stone-400 hover:text-red-600 transition"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
