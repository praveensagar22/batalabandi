'use client';

import { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import AuthModal from '@/components/common/AuthModal';
import { getStoredUser, UserProfile } from '@/lib/api/auth';

interface HeaderProps {
  activeTab?: string;
}

const themeStyles: Record<string, { bg: string; text: string }> = {
  all: { bg: 'bg-[#facc15]', text: 'text-stone-900' },
  painted: { bg: 'bg-[#f59e0b]', text: 'text-stone-950' },
  thread: { bg: 'bg-[#8b5cf6]', text: 'text-white' },
  printed: { bg: 'bg-[#10b981]', text: 'text-white' },
};

export default function Header({ activeTab = 'all' }: HeaderProps) {
  const currentTheme = themeStyles[activeTab] || themeStyles.all;
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const checkUser = () => {
    setUser(getStoredUser());
  };

  useEffect(() => {
    checkUser();
    window.addEventListener('storage', checkUser);
    window.addEventListener('cart-updated', checkUser);
    return () => {
      window.removeEventListener('storage', checkUser);
      window.removeEventListener('cart-updated', checkUser);
    };
  }, []);

  return (
    <header className={`${currentTheme.bg} sticky top-0 z-40 px-4 py-1.5 flex items-center justify-between transition-colors duration-300 shadow-2xs`}>
      {/* Brand */}
      <Link href="/" className="flex items-center">
        <div className="relative h-8 w-28 sm:w-32 overflow-hidden">
          <Image
            src="/logo.png"
            alt="BatalaBandi"
            fill
            unoptimized
            priority
            className="object-contain object-left"
          />
        </div>
      </Link>

      {/* Profile / Actions */}
      <div className="flex items-center gap-1">
        {user ? (
          <Link
            href="/profile"
            className="w-8 h-8 rounded-full bg-stone-950 text-amber-300 font-extrabold flex items-center justify-center text-xs shadow-xs"
            aria-label="Go to profile"
          >
            {user.name.charAt(0).toUpperCase()}
          </Link>
        ) : (
          <button
            onClick={() => setIsAuthOpen(true)}
            className={`w-9 h-9 flex items-center justify-center rounded-full hover:bg-black/10 transition-colors ${currentTheme.text}`}
            aria-label="Open Login Modal"
          >
            <User className="w-5 h-5" strokeWidth={2} />
          </button>
        )}
      </div>

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={(u) => setUser(u)}
      />
    </header>
  );
}
