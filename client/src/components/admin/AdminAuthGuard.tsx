'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ShieldCheck, Loader2 } from 'lucide-react';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import { SidebarProvider } from './SidebarContext';

export default function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Skip guard for login page
    if (pathname === '/admin/login') {
      setIsAuthenticated(true);
      return;
    }

    const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
    if (!token) {
      setIsAuthenticated(false);
      router.replace('/admin/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [pathname, router]);

  // Special layout for login page without sidebar/header
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // Loading state while checking auth token
  if (isAuthenticated === null || isAuthenticated === false) {
    return (
      <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col items-center justify-center p-4 font-sans">
        <div className="flex flex-col items-center gap-3 animate-in fade-in duration-300">
          <div className="p-3.5 bg-yellow-400 text-stone-950 rounded-2xl shadow-xl shadow-yellow-400/20">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div className="flex items-center gap-2 text-sm font-bold text-stone-300">
            <Loader2 className="w-4 h-4 animate-spin text-yellow-400" />
            <span>Verifying Admin Authorization...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-stone-50 text-stone-900 overflow-hidden font-sans">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0 min-h-0">
          <AdminHeader />
          <main className="flex-1 min-h-0 p-4 sm:p-6 lg:p-8 overflow-y-auto bg-stone-50">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
