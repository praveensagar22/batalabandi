'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, Eye, EyeOff, Lock, Mail, ArrowRight, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { apiRequest } from '@/lib/api/client';

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleFillDemo = () => {
    setEmail('admin@batalabandi.com');
    setPassword('Admin@123');
    setErrorMsg(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const response = await apiRequest<{
        status: string;
        message: string;
        data: {
          user: { id: string; name: string; email: string; role: string };
          accessToken: string;
        };
      }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (response.data?.accessToken) {
        localStorage.setItem('token', response.data.accessToken);
        localStorage.setItem('adminToken', response.data.accessToken);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        setSuccessMsg('Authentication successful! Redirecting to Dashboard...');
        setTimeout(() => {
          router.push('/admin');
        }, 1000);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid email or password. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-yellow-400 selection:text-stone-950">
      {/* Background Decorative Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-yellow-400/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md bg-stone-900/90 border border-stone-800 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-in zoom-in-95 duration-300">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3 bg-yellow-400 text-stone-950 rounded-2xl shadow-lg shadow-yellow-400/20 mb-2">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white uppercase">
            BatalaBandi <span className="text-yellow-400">Admin</span>
          </h1>
          <p className="text-xs text-stone-400 font-medium">
            Central Management System & Inventory Portal
          </p>
        </div>

        {/* Demo Credentials Quick Fill Button */}
        <div className="p-3.5 bg-yellow-400/10 border border-yellow-400/30 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-yellow-400 fill-yellow-400 flex-shrink-0" />
            <div className="text-[11px]">
              <span className="font-extrabold text-yellow-400 block">Demo Admin Credentials</span>
              <span className="text-stone-300 font-mono">admin@batalabandi.com</span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleFillDemo}
            className="px-3 py-1.5 bg-yellow-400 hover:bg-yellow-500 text-stone-950 text-xs font-black rounded-xl transition shadow-xs flex-shrink-0"
          >
            Auto Fill
          </button>
        </div>

        {/* Banners */}
        {errorMsg && (
          <div className="p-3.5 bg-red-950/80 border border-red-500/40 text-red-300 text-xs rounded-xl flex items-start gap-2.5 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs rounded-xl flex items-start gap-2.5 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="block text-xs font-bold text-stone-300 mb-1.5">
              Admin Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3 text-stone-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@batalabandi.com"
                className="w-full bg-stone-950/80 border border-stone-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-stone-600 outline-none focus:border-yellow-400 focus:bg-stone-950 transition font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3 text-stone-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-stone-950/80 border border-stone-800 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder:text-stone-600 outline-none focus:border-yellow-400 focus:bg-stone-950 transition font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-stone-500 hover:text-stone-300 transition"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-[#facc15] hover:bg-[#eab308] disabled:opacity-50 text-stone-950 text-xs font-black rounded-xl shadow-lg shadow-yellow-400/20 transition flex items-center justify-center gap-2 mt-2"
          >
            {isLoading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In to Admin Portal</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="pt-2 text-center text-[11px] text-stone-500 border-t border-stone-800/80">
          BatalaBandi Commerce System v2.0 • Secured Admin Authorization
        </div>
      </div>
    </div>
  );
}
