'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Sparkles,
  Truck,
  ShieldCheck,
  RotateCcw,
  Headphones,
  Mail,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

export default function DesktopFooter() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setEmail('');
        setSubscribed(false);
      }, 3500);
    }
  };

  return (
    <footer className="bg-stone-950 text-stone-300 font-sans border-t border-stone-800 pt-16 pb-8 relative overflow-hidden">
      {/* Muggu Traditional Pattern Background Watermark */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-10 mix-blend-screen pointer-events-none"
        style={{ backgroundImage: "url('/muggu-pattern.jpg')" }}
      />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Top Value Proposition Badges Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-12 border-b border-stone-800/80">
          <div className="flex items-center gap-4 bg-stone-900/60 p-4 rounded-2xl border border-stone-800/60">
            <div className="w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-white">Free Express Shipping</h4>
              <p className="text-xs text-stone-400 font-medium">On all orders above ₹999 across India</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-stone-900/60 p-4 rounded-2xl border border-stone-800/60">
            <div className="w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center shrink-0">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-white">7-Day Size Exchange</h4>
              <p className="text-xs text-stone-400 font-medium">Hassle-free size & defect exchange</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-stone-900/60 p-4 rounded-2xl border border-stone-800/60">
            <div className="w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-white">100% Authentic Handcrafted</h4>
              <p className="text-xs text-stone-400 font-medium">Super-combed organic cotton apparel</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-stone-900/60 p-4 rounded-2xl border border-stone-800/60">
            <div className="w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center shrink-0">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-white">Dedicated Support</h4>
              <p className="text-xs text-stone-400 font-medium">Customer assistance 6 days a week</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links & Newsletter Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 py-12 border-b border-stone-800/80">
          {/* Brand Info (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2">
              <div className="relative h-10 w-44">
                <Image
                  src="/logo.png"
                  alt="BatalaBandi"
                  fill
                  unoptimized
                  className="object-contain object-left"
                />
              </div>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed font-medium">
              BatalaBandi (బట్టల బండి) is your destination for premium handcrafted streetwear, bio-washed oversized tees, Kantha stitch tops, and authentic artisan apparel drops.
            </p>

            <div className="flex items-center gap-2 pt-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-stone-400 bg-stone-900 px-3 py-1 rounded-full border border-stone-800">
                ✦ Artisan Series 2026 ✦
              </span>
            </div>
          </div>

          {/* Quick Category Links (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-black text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 fill-amber-400" />
              Categories & Drops
            </h4>
            <ul className="space-y-2 text-xs font-semibold text-stone-400">
              <li>
                <Link href="/products?search=Men" className="hover:text-white transition-colors">
                  Men&apos;s Streetwear Collection
                </Link>
              </li>
              <li>
                <Link href="/products?search=Women" className="hover:text-white transition-colors">
                  Women&apos;s Artisan Tops & Kurtas
                </Link>
              </li>
              <li>
                <Link href="/products?search=Unisex" className="hover:text-white transition-colors">
                  Unisex Oversized Hoodies & Tees
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-white transition-colors">
                  Shop by Artisan Categories
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About BatalaBandi
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-black text-amber-400 uppercase tracking-widest">Customer Care</h4>
            <ul className="space-y-2 text-xs font-semibold text-stone-400">
              <li>
                <Link href="/refund-policy" className="hover:text-white transition-colors">
                  Return & Exchange Policy
                </Link>
              </li>
              <li>
                <Link href="/shipping-policy" className="hover:text-white transition-colors">
                  Shipping & Delivery
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-white transition-colors">
                  Track Your Order
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Subscription (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-black text-amber-400 uppercase tracking-widest">Stay in the Loop</h4>
            <p className="text-xs text-stone-400 font-medium">
              Subscribe to get notified first on new artisan drops & exclusive offers.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder:text-stone-500 font-semibold focus:outline-none focus:border-amber-400 transition"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 bg-[#facc15] hover:bg-amber-400 text-stone-950 rounded-lg transition active:scale-95"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>

            {subscribed && (
              <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold pt-1 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4" />
                <span>Subscribed! Check your inbox for updates.</span>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Copyright & Payment Methods Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-semibold text-stone-500">
          <p>© 2026 BatalaBandi (బట్టల బండి). All rights reserved.</p>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="bg-stone-900 border border-stone-800 px-3 py-1 rounded-lg text-stone-400">
              Razorpay Secured
            </span>
            <span className="bg-stone-900 border border-stone-800 px-3 py-1 rounded-lg text-stone-400">
              UPI Payments
            </span>
            <span className="bg-stone-900 border border-stone-800 px-3 py-1 rounded-lg text-stone-400">
              256-Bit SSL
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
