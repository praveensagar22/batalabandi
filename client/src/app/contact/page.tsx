'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, MessageSquare, Send, CheckCircle2, ChevronRight, Clock, Sparkles } from 'lucide-react';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import DesktopHeader from '@/components/DesktopHeader';
import DesktopFooter from '@/components/DesktopFooter';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    orderId: '',
    subject: 'General Inquiry',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        orderId: '',
        subject: 'General Inquiry',
        message: '',
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] font-sans text-stone-900 selection:bg-amber-400 selection:text-stone-950">
      {/* ===== DESKTOP HEADER ===== */}
      <div className="hidden md:block">
        <DesktopHeader />
      </div>

      {/* ===== MOBILE HEADER ===== */}
      <div className="block md:hidden">
        <Header activeTab="all" />
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <main className="max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-14">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs text-stone-400 font-semibold mb-6">
          <Link href="/" className="hover:text-stone-950 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-stone-900 font-bold">Contact Us</span>
        </div>

        {/* Page Header Banner */}
        <div className="bg-stone-950 text-white rounded-3xl p-6 md:p-10 border border-stone-800 shadow-xl mb-10 relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-amber-400 bg-stone-900/80 border border-amber-400/20 px-3.5 py-1.5 rounded-full">
              <MessageSquare className="w-4 h-4 text-amber-400" />
              We&apos;re Here To Help
            </div>
            <h1 className="text-2xl md:text-4xl font-black font-serif text-white">
              Contact BatalaBandi (బట్టల బండి)
            </h1>
            <p className="text-xs md:text-sm text-stone-300 max-w-2xl font-medium leading-relaxed">
              Have questions about your order, size fitting, or custom artisan drops? Get in touch with our support team.
            </p>
          </div>
        </div>

        {/* 2 Column Layout: Info Cards + Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Direct Contact Info (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-2xs space-y-6">
              <h3 className="text-sm font-black text-stone-950 uppercase tracking-wider border-b border-stone-100 pb-3">
                Customer Support Info
              </h3>

              <div className="space-y-5 text-xs text-stone-700">
                {/* Email */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-600 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-stone-950 text-xs">Customer Service Email</h4>
                    <a href="mailto:support@batalabandi.com" className="text-amber-700 font-bold hover:underline">
                      support@batalabandi.com
                    </a>
                    <p className="text-[11px] text-stone-400 font-medium">Response within 24 business hours</p>
                  </div>
                </div>

                {/* Phone & WhatsApp */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-600 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-stone-950 text-xs">Phone & WhatsApp Support</h4>
                    <p className="text-stone-900 font-bold font-mono">+91 98765 43210</p>
                    <p className="text-[11px] text-stone-400 font-medium">Mon – Sat: 10:00 AM – 7:00 PM IST</p>
                  </div>
                </div>

                {/* Operating Address */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-600 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-stone-950 text-xs">Fulfillment & Studio Address</h4>
                    <p className="text-stone-600 font-medium leading-relaxed mt-0.5">
                      BatalaBandi Studios, Jubilee Hills, Road No. 36,<br />
                      Hyderabad, Telangana – 500033, India
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Link Card */}
            <div className="bg-stone-950 text-white rounded-3xl p-6 border border-stone-800 space-y-3">
              <h4 className="text-xs font-black text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" /> Need Quick Answers?
              </h4>
              <p className="text-xs text-stone-300 font-medium leading-relaxed">
                Check our Return & Exchange policy or view real-time shipping guidelines.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <Link
                  href="/refund-policy"
                  className="px-3.5 py-1.5 bg-stone-900 border border-stone-800 rounded-xl text-[11px] text-stone-300 font-bold hover:text-white hover:border-amber-400/40 transition"
                >
                  Size Exchange Policy
                </Link>
                <Link
                  href="/shipping-policy"
                  className="px-3.5 py-1.5 bg-stone-900 border border-stone-800 rounded-xl text-[11px] text-stone-300 font-bold hover:text-white hover:border-amber-400/40 transition"
                >
                  Shipping Timelines
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 md:p-8 border border-stone-200/90 shadow-2xs">
            <h3 className="text-base font-black text-stone-950 mb-1">Send Us a Message</h3>
            <p className="text-xs text-stone-500 font-medium mb-6">
              Fill out the form below and our customer care team will respond promptly.
            </p>

            {submitted ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-3 animate-in fade-in">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="text-base font-black text-emerald-950">Message Sent Successfully!</h4>
                <p className="text-xs text-emerald-800 max-w-sm mx-auto font-medium">
                  Thank you for contacting BatalaBandi. We have received your message and will reply to your email within 24 hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-5 py-2 bg-emerald-900 text-white text-xs font-bold rounded-xl hover:bg-emerald-950 transition mt-2"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-extrabold text-stone-800 mb-1.5">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Praveen Sagar"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-semibold focus:outline-none focus:border-amber-400 transition"
                    />
                  </div>

                  <div>
                    <label className="block font-extrabold text-stone-800 mb-1.5">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="praveen@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-semibold focus:outline-none focus:border-amber-400 transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-extrabold text-stone-800 mb-1.5">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-semibold focus:outline-none focus:border-amber-400 transition"
                    />
                  </div>

                  <div>
                    <label className="block font-extrabold text-stone-800 mb-1.5">Order ID (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. BB-9842"
                      value={formData.orderId}
                      onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
                      className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-semibold focus:outline-none focus:border-amber-400 transition font-mono uppercase"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-extrabold text-stone-800 mb-1.5">Subject *</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-semibold focus:outline-none focus:border-amber-400 transition"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Size Exchange Request">Size Exchange Request</option>
                    <option value="Order Delivery Status">Order Delivery Status</option>
                    <option value="Damaged/Wrong Item Issue">Damaged/Wrong Item Issue</option>
                    <option value="Artisan Collaboration">Artisan Collaboration</option>
                  </select>
                </div>

                <div>
                  <label className="block font-extrabold text-stone-800 mb-1.5">Message / Inquiry *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Describe how we can help you..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-semibold focus:outline-none focus:border-amber-400 transition"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-[#facc15] hover:bg-amber-400 text-stone-950 font-black rounded-xl shadow-xs transition flex items-center justify-center gap-2 text-xs uppercase tracking-wider disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Submitting...' : 'Send Message'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      {/* Mobile Dock Navigation */}
      <div className="block md:hidden">
        <BottomNav />
      </div>

      {/* ===== DESKTOP FOOTER ===== */}
      <div className="hidden md:block">
        <DesktopFooter />
      </div>
    </div>
  );
}
