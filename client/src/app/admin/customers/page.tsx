'use client';

import { useState, useEffect } from 'react';
import { Shield, UserCheck, Search, RefreshCw, Loader2, Users, ShoppingBag, Calendar, Mail } from 'lucide-react';
import { fetchAdminUsersAPI, updateAdminUserRoleAPI, AdminUser } from '@/lib/api/admin';

export default function AdminCustomersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'user' | 'admin'>('all');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAdminUsersAPI();
      setUsers(data);
    } catch (err) {
      console.warn('Failed to load admin customers:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const toggleRole = async (userId: string, currentRole: 'user' | 'admin') => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      await updateAdminUserRoleAPI(userId, newRole);
      setUsers(users.map((u) => (u._id === userId ? { ...u, role: newRole } : u)));
      showToast(`Account role updated to ${newRole.toUpperCase()}`);
    } catch (err) {
      showToast('Failed to update role on server');
    }
  };

  const filtered = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const totalCustomers = users.filter((u) => u.role === 'user').length;
  const totalAdmins = users.filter((u) => u.role === 'admin').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-stone-950 text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-lg border border-amber-400">
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-stone-950 tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-amber-600" />
            <span>Customer & User Directory</span>
          </h1>
          <p className="text-sm text-stone-500 mt-0.5">
            Manage customer accounts, search emails, and assign administrator privileges.
          </p>
        </div>
        <button
          onClick={loadUsers}
          disabled={isLoading}
          className="flex items-center gap-2 px-3.5 py-2 bg-white text-stone-700 text-xs font-semibold rounded-xl transition border border-stone-200 hover:border-stone-300 shadow-xs active:scale-95 disabled:opacity-50 self-start sm:self-auto"
        >
          {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5 text-stone-400" />}
          Refresh Customers
        </button>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="bg-white border border-stone-100 p-4 rounded-2xl shadow-xs">
          <span className="text-xs font-semibold text-stone-400">Total Registered</span>
          <h3 className="text-xl font-black text-stone-950 mt-1">{users.length}</h3>
        </div>
        <div className="bg-white border border-stone-100 p-4 rounded-2xl shadow-xs">
          <span className="text-xs font-semibold text-stone-400">Shopper Accounts</span>
          <h3 className="text-xl font-black text-emerald-600 mt-1">{totalCustomers}</h3>
        </div>
        <div className="bg-white border border-stone-100 p-4 rounded-2xl shadow-xs col-span-2 sm:col-span-1">
          <span className="text-xs font-semibold text-stone-400">Store Administrators</span>
          <h3 className="text-xl font-black text-amber-600 mt-1">{totalAdmins}</h3>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white border border-stone-100 rounded-2xl p-3 sm:p-4 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name or email..."
            className="w-full bg-stone-50 border border-stone-200 text-stone-800 text-xs rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-yellow-300 transition"
          />
        </div>

        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl w-full sm:w-auto">
          {(['all', 'user', 'admin'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex-1 sm:flex-none capitalize ${
                roleFilter === r
                  ? 'bg-white text-stone-950 shadow-xs'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              {r === 'all' ? 'All Accounts' : r === 'user' ? 'Customers' : 'Admins'}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="py-16 text-center bg-white rounded-2xl border border-stone-100 p-6 space-y-2 shadow-xs">
          <Loader2 className="w-7 h-7 border-stone-900 animate-spin mx-auto text-amber-500" />
          <p className="text-xs font-bold text-stone-700">Loading Customer Accounts...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-2xl border border-stone-100 p-6 space-y-2 shadow-xs">
          <p className="text-sm font-black text-stone-900">No customers found</p>
          <p className="text-xs text-stone-400">Registered users will show up here.</p>
        </div>
      ) : (
        <>
          {/* Mobile: Card View */}
          <div className="sm:hidden space-y-3">
            {filtered.map((u) => (
              <div key={u._id} className="bg-white border border-stone-100 rounded-2xl p-4 shadow-xs">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-[#facc15] text-stone-950 font-black flex items-center justify-center text-sm shadow-xs shrink-0">
                    {u.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-stone-900 truncate">{u.name}</h4>
                    <p className="text-[10px] text-stone-400 truncate">{u.email}</p>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 shrink-0 ${
                      u.role === 'admin'
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-stone-100 text-stone-600 border border-stone-200'
                    }`}
                  >
                    {u.role === 'admin' ? <Shield className="w-3 h-3" /> : <UserCheck className="w-3 h-3" />}
                    {u.role.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-stone-400 pt-2 border-t border-stone-100">
                  <span>Joined: {new Date(u.createdAt || Date.now()).toLocaleDateString()}</span>
                  <button
                    onClick={() => toggleRole(u._id, u.role)}
                    className="px-3 py-1.5 bg-[#facc15] hover:bg-[#eab308] text-stone-950 text-[10px] font-bold rounded-xl transition active:scale-95"
                  >
                    Make {u.role === 'admin' ? 'Customer' : 'Admin'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: Table */}
          <div className="hidden sm:block bg-white border border-stone-100 rounded-2xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-100 text-stone-400 font-semibold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Customer Name</th>
                    <th className="py-3 px-4">Email Address</th>
                    <th className="py-3 px-4">Account Type</th>
                    <th className="py-3 px-4">Registered Date</th>
                    <th className="py-3 px-4 text-right">Role Management</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filtered.map((u) => (
                    <tr key={u._id} className="hover:bg-yellow-50/40 transition">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#facc15] text-stone-950 font-black flex items-center justify-center text-xs shadow-xs">
                            {u.name.slice(0, 2).toUpperCase()}
                          </div>
                          <span className="font-bold text-stone-900">{u.name}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-stone-600 font-medium">
                        <span className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-stone-400" />
                          {u.email}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                            u.role === 'admin'
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          }`}
                        >
                          {u.role === 'admin' ? <Shield className="w-3 h-3 text-amber-600" /> : <UserCheck className="w-3 h-3 text-emerald-600" />}
                          {u.role === 'admin' ? 'ADMIN' : 'CUSTOMER'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-stone-400 font-medium">
                        {new Date(u.createdAt || Date.now()).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => toggleRole(u._id, u.role)}
                          className="px-3 py-1.5 bg-[#facc15] hover:bg-[#eab308] text-stone-950 text-[11px] font-bold rounded-xl transition shadow-2xs active:scale-95"
                        >
                          Make {u.role === 'admin' ? 'Customer' : 'Admin'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
