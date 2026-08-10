'use client';

import { useState } from 'react';
import { Shield, UserCheck, Search } from 'lucide-react';

type UserRole = 'user' | 'admin';

interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  joined: string;
  orders: number;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRecord[]>([
    { id: 'USR-1', name: 'System Admin', email: 'admin@batalabandi.com', role: 'admin', joined: '15 Jan 2026', orders: 0 },
    { id: 'USR-2', name: 'Priya Sharma', email: 'priya@example.com', role: 'user', joined: '20 Jul 2026', orders: 3 },
    { id: 'USR-3', name: 'Rahul Verma', email: 'rahul@example.com', role: 'user', joined: '28 Jul 2026', orders: 1 },
    { id: 'USR-4', name: 'Anita Singh', email: 'anita@example.com', role: 'user', joined: '31 Jul 2026', orders: 5 },
  ]);

  const [search, setSearch] = useState('');

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const toggleRole = (id: string) => {
    setUsers(users.map((u) =>
      u.id === id ? { ...u, role: u.role === 'admin' ? 'user' : 'admin' } : u
    ));
  };

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-stone-950 tracking-tight">
          User Management
        </h1>
        <p className="text-sm text-stone-500 mt-0.5">Manage accounts & assign admin permissions.</p>
      </div>

      {/* Search */}
      <div className="bg-white border border-stone-100 rounded-2xl p-3 sm:p-4 shadow-sm">
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
      </div>

      {/* Mobile: Card View */}
      <div className="sm:hidden space-y-3">
        {filtered.map((u) => (
          <div key={u.id} className="bg-white border border-stone-100 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-[#facc15] text-stone-950 font-black flex items-center justify-center text-sm shadow">
                {u.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-stone-900 truncate">{u.name}</h4>
                <p className="text-[10px] text-stone-400 truncate">{u.email}</p>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                u.role === 'admin'
                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                  : 'bg-stone-100 text-stone-600 border border-stone-200'
              }`}>
                {u.role === 'admin' ? <Shield className="w-3 h-3" /> : <UserCheck className="w-3 h-3" />}
                {u.role.toUpperCase()}
              </span>
            </div>
            <div className="flex items-center justify-between text-[10px] text-stone-400">
              <span>Joined: {u.joined} · {u.orders} orders</span>
              <button
                onClick={() => toggleRole(u.id)}
                className="px-3 py-1.5 bg-[#facc15] hover:bg-[#eab308] text-stone-950 text-[10px] font-bold rounded-xl transition"
              >
                Make {u.role === 'admin' ? 'User' : 'Admin'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: Table */}
      <div className="hidden sm:block bg-white border border-stone-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-100 text-stone-400 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">User</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Orders</th>
                <th className="p-4">Joined</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-yellow-50/40 transition">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#facc15] text-stone-950 font-black flex items-center justify-center text-xs shadow-sm flex-shrink-0">
                        {u.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-bold text-stone-900">{u.name}</h4>
                        <p className="text-[10px] text-stone-400">{u.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-stone-600">{u.email}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 w-fit ${
                      u.role === 'admin'
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-stone-100 text-stone-600 border border-stone-200'
                    }`}>
                      {u.role === 'admin' ? <Shield className="w-3 h-3" /> : <UserCheck className="w-3 h-3" />}
                      {u.role.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4 font-semibold text-stone-700">{u.orders}</td>
                  <td className="p-4 text-stone-500">{u.joined}</td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => toggleRole(u.id)}
                      className="px-3 py-1.5 bg-[#facc15] hover:bg-[#eab308] text-stone-950 text-[10px] font-bold rounded-xl transition"
                    >
                      Make {u.role === 'admin' ? 'User' : 'Admin'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
