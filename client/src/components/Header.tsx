'use client';

import { User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface HeaderProps {
  activeTab?: string;
}

const themeStyles: Record<string, { bg: string; text: string }> = {
  all: { bg: "bg-[#facc15]", text: "text-stone-900" },
  painted: { bg: "bg-[#f59e0b]", text: "text-stone-950" },
  thread: { bg: "bg-[#8b5cf6]", text: "text-white" },
  printed: { bg: "bg-[#10b981]", text: "text-white" },
};

export default function Header({ activeTab = "all" }: HeaderProps) {
  const currentTheme = themeStyles[activeTab] || themeStyles.all;

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
        <Link
          href="/profile"
          className={`w-9 h-9 flex items-center justify-center rounded-full hover:bg-black/10 transition-colors ${currentTheme.text}`}
          aria-label="Go to profile"
        >
          <User className="w-5 h-5" strokeWidth={2} />
        </Link>
      </div>
    </header>
  );
}
