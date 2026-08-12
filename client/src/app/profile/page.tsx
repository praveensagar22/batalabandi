'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Bell,
  ChevronRight,
  CircleHelp,
  ClipboardList,
  MapPin,
  Package,
  ShieldCheck,
  Sparkles,
  UserRound,
  Wallet2,
  Clock,
  LogOut,
  LogIn,
  Heart,
  Edit3,
  Plus,
  X,
  Phone,
  Mail,
  CheckCircle2,
  MessageSquare,
} from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import Header from '@/components/Header';
import DesktopHeader from '@/components/DesktopHeader';
import DesktopFooter from '@/components/DesktopFooter';
import AuthModal from '@/components/common/AuthModal';
import { getMyOrdersAPI, OrderResponse } from '@/lib/api/orders';
import { getStoredUser, logoutAPI, UserProfile, getMeAPI } from '@/lib/api/auth';
import { getWishlist } from '@/lib/wishlist/store';

export interface Address {
  id: string;
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [loadingOrders, setLoadingOrders] = useState(true);
  
  // Modals & Drawers State
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Edit Profile Form State
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');

  // Saved Addresses State
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: '1',
      name: 'Praveen Sagar',
      phone: '+91 9876543210',
      street: 'Flat 402, Jubilee Hills Road No 36',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500033',
      isDefault: true,
    },
  ]);
  const [newStreet, setNewStreet] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newState, setNewState] = useState('');
  const [newPincode, setNewPincode] = useState('');
  const [isAddingAddress, setIsAddingAddress] = useState(false);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  async function loadUserAndOrders() {
    const stored = getStoredUser();
    setUser(stored);
    if (stored) {
      setEditName(stored.name || '');
      setEditPhone(stored.phone || '');
    }

    const wish = getWishlist();
    setWishlistCount(wish.length);

    if (stored) {
      setLoadingOrders(true);
      try {
        const [serverUser, data] = await Promise.all([
          getMeAPI().catch(() => null),
          getMyOrdersAPI().catch(() => []),
        ]);

        if (serverUser) {
          setUser(serverUser);
          setEditName(serverUser.name || '');
          setEditPhone(serverUser.phone || '');
        }
        if (data) {
          setOrders(data);
        }
      } catch (err) {
        console.warn('Failed to load user profile/orders:', err);
      } finally {
        setLoadingOrders(false);
      }
    } else {
      setOrders([]);
      setLoadingOrders(false);
    }
  }

  useEffect(() => {
    loadUserAndOrders();
    window.addEventListener('auth-updated', loadUserAndOrders);

    return () => {
      window.removeEventListener('auth-updated', loadUserAndOrders);
    };
  }, []);

  const handleLogout = async () => {
    await logoutAPI();
    setUser(null);
    setOrders([]);
    showToast('Logged out successfully');
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (user && editName.trim()) {
      const updated = { ...user, name: editName.trim(), phone: editPhone.trim() };
      setUser(updated);
      localStorage.setItem('user', JSON.stringify(updated));
      setIsEditProfileOpen(false);
      showToast('Profile updated successfully! ✨');
      window.dispatchEvent(new Event('cart-updated'));
    }
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (newStreet.trim() && newCity.trim() && newPincode.trim()) {
      const newAddr: Address = {
        id: Date.now().toString(),
        name: user?.name || 'Customer',
        phone: editPhone || '+91 9876543210',
        street: newStreet.trim(),
        city: newCity.trim(),
        state: newState.trim() || 'Telangana',
        pincode: newPincode.trim(),
        isDefault: addresses.length === 0,
      };
      setAddresses([...addresses, newAddr]);
      setNewStreet('');
      setNewCity('');
      setNewState('');
      setNewPincode('');
      setIsAddingAddress(false);
      showToast('New Delivery Address Saved! 📍');
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] text-stone-900 font-sans selection:bg-amber-400 selection:text-stone-950">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-stone-950 text-white text-xs font-bold px-5 py-3 rounded-full shadow-2xl flex items-center gap-2 border border-amber-400 animate-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* ===== DESKTOP HEADER (>= 768px) ===== */}
      <div className="hidden md:block">
        <DesktopHeader />
      </div>

      {/* ===== MOBILE HEADER (< 768px) ===== */}
      <div className="block md:hidden">
        <Header activeTab="all" />
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10">
        {/* Desktop Breadcrumbs */}
        <div className="hidden md:flex items-center gap-2 text-xs text-stone-400 font-semibold mb-6">
          <Link href="/" className="hover:text-stone-950 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-stone-900 font-bold">My Account & Dashboard</span>
        </div>

        {/* 2-Column Responsive Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ===== LEFT COLUMN: USER AVATAR & ACCOUNT MENU (4 COLS ON DESKTOP) ===== */}
          <div className="lg:col-span-4 space-y-6">
            {/* User Profile Card */}
            <section className="rounded-3xl border border-stone-200/90 bg-white p-6 shadow-2xs">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#facc15] text-2xl font-black text-stone-900 shadow-xs border border-amber-300">
                    {user ? user.name.charAt(0).toUpperCase() : <UserRound className="w-8 h-8 text-stone-800" />}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h1 className="text-lg font-black tracking-tight text-stone-950 truncate flex items-center gap-2">
                      <span>{user ? user.name : 'Guest User'}</span>
                      {user && (
                        <button
                          onClick={() => setIsEditProfileOpen(true)}
                          className="text-stone-400 hover:text-stone-950"
                          title="Edit Name & Phone"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      )}
                    </h1>
                    <p className="mt-0.5 text-xs text-stone-500 font-semibold truncate" title={user ? user.email : ''}>
                      {user ? user.email : 'Log in to sync cart & track orders'}
                    </p>
                  </div>
                </div>

                <div className="shrink-0">
                  {user ? (
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl border border-red-200 transition active:scale-95"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Logout</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setShowAuthModal(true)}
                      className="flex items-center gap-1.5 px-4 py-2 text-xs font-black text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-xs transition active:scale-95"
                    >
                      <LogIn className="w-4 h-4" />
                      <span>Log In</span>
                    </button>
                  )}
                </div>
              </div>
            </section>

            {/* Quick Links */}
            <section className="space-y-3">
              <Link
                href="/products"
                className="w-full flex items-center justify-between rounded-3xl border border-stone-200/90 bg-white p-4 text-left shadow-2xs transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-800">
                    <Package className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-bold text-stone-900 text-xs md:text-sm">Explore Garment Drops</p>
                    <p className="text-[11px] text-stone-500">Discover handcrafted artisan apparel drops</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-stone-400" />
              </Link>

              <button
                onClick={() => setIsHelpOpen(true)}
                type="button"
                className="w-full flex items-center justify-between rounded-3xl border border-stone-200/90 bg-white p-4 text-left shadow-2xs transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-stone-100 text-stone-800">
                    <CircleHelp className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-bold text-stone-900 text-xs md:text-sm">Help & Support</p>
                    <p className="text-[11px] text-stone-500">Assistance for returns, size exchange & delivery</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-stone-400" />
              </button>
            </section>

            {/* Account Settings List */}
            <section className="space-y-4">
              <div className="rounded-3xl border border-stone-200/90 bg-white p-5 shadow-2xs space-y-3">
                <h2 className="text-xs font-black uppercase tracking-[0.24em] text-stone-500 border-b border-stone-100 pb-2">
                  Account Management
                </h2>

                <div className="space-y-2">
                  <button
                    onClick={() => setIsEditProfileOpen(true)}
                    type="button"
                    className="flex w-full items-center justify-between rounded-2xl border border-stone-100 bg-stone-50/50 px-3.5 py-3 text-left transition hover:border-stone-200 hover:bg-stone-100 text-xs font-bold text-stone-800"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-stone-700 shadow-2xs">
                        <UserRound className="h-4 w-4" />
                      </div>
                      <span>Edit Personal Details</span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-stone-400" />
                  </button>

                  <button
                    onClick={() => setIsAddressModalOpen(true)}
                    type="button"
                    className="flex w-full items-center justify-between rounded-2xl border border-stone-100 bg-stone-50/50 px-3.5 py-3 text-left transition hover:border-stone-200 hover:bg-stone-100 text-xs font-bold text-stone-800"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-stone-700 shadow-2xs">
                        <MapPin className="h-4 w-4" />
                      </div>
                      <span>Saved Delivery Addresses ({addresses.length})</span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-stone-400" />
                  </button>

                  <Link
                    href="/wishlist"
                    className="flex w-full items-center justify-between rounded-2xl border border-stone-100 bg-stone-50/50 px-3.5 py-3 text-left transition hover:border-stone-200 hover:bg-stone-100 text-xs font-bold text-stone-800"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-stone-700 shadow-2xs">
                        <Heart className="h-4 w-4 text-red-500" />
                      </div>
                      <span>Your Saved Wishlist ({wishlistCount})</span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-stone-400" />
                  </Link>
                </div>
              </div>
            </section>
          </div>

          {/* ===== RIGHT COLUMN: ORDER HISTORY & METRICS (8 COLS ON DESKTOP) ===== */}
          <div className="lg:col-span-8 space-y-6">
            {/* Dashboard Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-3xl border border-stone-200/90 bg-white p-5 shadow-2xs">
                <div className="flex items-center justify-between text-xs font-bold text-stone-700">
                  <span className="flex items-center gap-2">
                    <ClipboardList className="h-4 w-4 text-amber-500" />
                    Total Orders
                  </span>
                </div>
                <p className="mt-3 text-3xl font-black text-stone-950 font-mono">
                  {loadingOrders ? '...' : orders.length}
                </p>
              </div>

              <div className="rounded-3xl border border-stone-200/90 bg-white p-5 shadow-2xs">
                <div className="flex items-center gap-2 text-xs font-bold text-stone-700">
                  <Heart className="h-4 w-4 text-red-500" />
                  Wishlist Saved
                </div>
                <p className="mt-3 text-3xl font-black text-stone-950 font-mono">{wishlistCount}</p>
              </div>

              <div className="rounded-3xl border border-stone-200/90 bg-white p-5 shadow-2xs">
                <div className="flex items-center gap-2 text-xs font-bold text-stone-700">
                  <MapPin className="h-4 w-4 text-purple-500" />
                  Saved Addresses
                </div>
                <p className="mt-3 text-3xl font-black text-stone-950 font-mono">{addresses.length}</p>
              </div>
            </div>

            {/* Recent Orders List Section */}
            <section className="rounded-3xl border border-stone-200/90 bg-white p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                <h2 className="text-lg font-black text-stone-900 flex items-center gap-2">
                  <Package className="w-5 h-5 text-amber-500" />
                  <span>Recent Order History</span>
                </h2>
                <span className="text-xs font-semibold text-stone-500 bg-stone-100 px-3 py-1 rounded-full border border-stone-200/60">
                  {orders.length} order{orders.length !== 1 ? 's' : ''} found
                </span>
              </div>

              {loadingOrders ? (
                <div className="py-12 text-center text-xs font-semibold text-stone-500">
                  Loading order history from server...
                </div>
              ) : orders.length === 0 ? (
                <div className="py-16 text-center space-y-3 bg-stone-50/50 rounded-2xl border border-stone-100 p-6">
                  <Package className="w-10 h-10 text-stone-300 mx-auto" />
                  <p className="text-sm font-bold text-stone-700">No orders placed yet</p>
                  <p className="text-xs text-stone-400 font-medium">Your recent orders will appear here for live tracking</p>
                  <Link
                    href="/products"
                    className="inline-block px-5 py-2.5 bg-[#facc15] text-stone-950 text-xs font-black rounded-xl shadow-2xs hover:bg-[#eab308] transition mt-2"
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-stone-100 space-y-3">
                  {orders.map((ord) => (
                    <div key={ord._id} className="pt-3 first:pt-0 flex items-center justify-between bg-stone-50/60 p-4 rounded-2xl border border-stone-200/60">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs md:text-sm font-black text-stone-950 font-mono">
                            {ord._id.startsWith('BB') ? ord._id : `BB-ORD-${ord._id.slice(-6).toUpperCase()}`}
                          </span>
                          <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                            {ord.orderStatus || 'Processing'}
                          </span>
                        </div>
                        <p className="text-xs text-stone-500 flex items-center gap-2 font-medium">
                          <Clock className="w-3.5 h-3.5 text-stone-400" />
                          <span>{new Date(ord.createdAt || Date.now()).toLocaleDateString()}</span>
                          <span>•</span>
                          <span>{ord.orderItems?.length || 1} Item(s)</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-stone-900 font-mono">₹{ord.totalAmount.toLocaleString('en-IN')}</p>
                        <span className="text-[10px] font-bold text-stone-500 uppercase">{ord.paymentMethod}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>

      {/* ===== EDIT PROFILE MODAL ===== */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border border-stone-200 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-sm font-black uppercase tracking-wider text-stone-950 flex items-center gap-2">
                <UserRound className="w-4 h-4 text-amber-500" /> Edit Profile Details
              </h3>
              <button
                onClick={() => setIsEditProfileOpen(false)}
                className="w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 hover:text-stone-950"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-stone-950"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Phone Number</label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  placeholder="+91 9876543210"
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-stone-950"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditProfileOpen(false)}
                  className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-stone-950 hover:bg-stone-800 text-white text-xs font-black rounded-xl transition shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== SAVED ADDRESSES MODAL ===== */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 border border-stone-200 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-sm font-black uppercase tracking-wider text-stone-950 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-purple-500" /> Saved Delivery Addresses
              </h3>
              <button
                onClick={() => setIsAddressModalOpen(false)}
                className="w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 hover:text-stone-950"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Address List */}
            <div className="space-y-3">
              {addresses.map((addr) => (
                <div key={addr.id} className="bg-stone-50/80 p-4 rounded-2xl border border-stone-200 space-y-1 relative">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-stone-950">{addr.name}</span>
                    {addr.isDefault && (
                      <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full border border-amber-200">
                        Default Address
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-600 font-medium">{addr.street}, {addr.city}, {addr.state} - {addr.pincode}</p>
                  <p className="text-[11px] text-stone-400 font-medium">{addr.phone}</p>
                </div>
              ))}
            </div>

            {/* Add Address Form Toggle */}
            {isAddingAddress ? (
              <form onSubmit={handleAddAddress} className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-3 pt-3">
                <h4 className="text-xs font-extrabold text-stone-900">Add New Address</h4>
                <div>
                  <input
                    type="text"
                    required
                    placeholder="Street / House No / Area"
                    value={newStreet}
                    onChange={(e) => setNewStreet(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs font-semibold focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="City"
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs font-semibold focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="State"
                    value={newState}
                    onChange={(e) => setNewState(e.target.value)}
                    className="px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs font-semibold focus:outline-none"
                  />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="Pincode"
                    value={newPincode}
                    onChange={(e) => setNewPincode(e.target.value.replace(/\D/g, ''))}
                    className="px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs font-semibold focus:outline-none"
                  />
                </div>
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsAddingAddress(false)}
                    className="flex-1 py-2 bg-stone-200 text-stone-800 text-xs font-bold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-stone-950 text-white text-xs font-bold rounded-xl"
                  >
                    Save Address
                  </button>
                </div>
              </form>
            ) : (
              <button
                onClick={() => setIsAddingAddress(true)}
                className="w-full py-3 bg-stone-100 hover:bg-stone-200 text-stone-950 text-xs font-bold rounded-2xl transition flex items-center justify-center gap-2 border border-stone-200"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Delivery Address</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* ===== HELP & SUPPORT DRAWER ===== */}
      {isHelpOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border border-stone-200 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-sm font-black uppercase tracking-wider text-stone-950 flex items-center gap-2">
                <CircleHelp className="w-4 h-4 text-amber-500" /> Instant Help & Support
              </h3>
              <button
                onClick={() => setIsHelpOpen(false)}
                className="w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 hover:text-stone-950"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-3.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-2xl transition text-xs font-bold text-emerald-950"
              >
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-5 h-5 text-emerald-600" />
                  <div>
                    <p className="font-extrabold">WhatsApp Customer Support</p>
                    <p className="text-[10px] text-emerald-700 font-normal">Instant replies for size exchange & order status</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-emerald-600" />
              </a>

              <a
                href="mailto:support@batalabandi.com"
                className="flex items-center justify-between p-3.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-2xl transition text-xs font-bold text-amber-950"
              >
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-amber-600" />
                  <div>
                    <p className="font-extrabold">Email Support</p>
                    <p className="text-[10px] text-amber-700 font-normal">support@batalabandi.com</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-amber-600" />
              </a>
            </div>

            <div className="pt-2 border-t border-stone-100 text-[11px] text-stone-500 font-medium leading-relaxed">
              <p>• <strong>Returns Policy:</strong> Free 7-day size exchange & return policy on all unworn items.</p>
              <p className="mt-1">• <strong>Delivery:</strong> Orders are dispatched within 24 hours from Hyderabad.</p>
            </div>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={(u) => {
          setUser(u);
          loadUserAndOrders();
        }}
      />

      {/* Mobile Dock Navigation */}
      <div className="block md:hidden">
        <BottomNav />
      </div>

      {/* ===== DESKTOP FOOTER (>= 768px) ===== */}
      <div className="hidden md:block">
        <DesktopFooter />
      </div>
    </div>
  );
}
