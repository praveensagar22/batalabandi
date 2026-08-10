import { apiRequest } from './client';

export interface AdminStatsResponse {
  totalUsers: number;
  totalProducts: number;
  totalCategories: number;
  totalOrders: number;
  totalSales: number;
  recentOrders: Array<{
    _id: string;
    totalAmount: number;
    orderStatus: string;
    createdAt: string;
    user?: { name: string; email: string };
  }>;
  lowStockProducts: Array<{
    _id: string;
    title: string;
    stock: number;
    price: number;
    category?: string;
  }>;
}

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export async function fetchAdminStatsAPI(): Promise<AdminStatsResponse> {
  const res = await apiRequest<{ status: string; data: { stats: AdminStatsResponse } }>('/admin/stats');
  return res.data.stats;
}

export async function fetchAdminUsersAPI(): Promise<AdminUser[]> {
  const res = await apiRequest<{ status: string; data: { users: AdminUser[] } }>('/admin/users');
  return res.data.users;
}

export async function updateAdminUserRoleAPI(userId: string, role: 'user' | 'admin'): Promise<AdminUser> {
  const res = await apiRequest<{ status: string; data: { user: AdminUser } }>(`/admin/users/${userId}/role`, {
    method: 'PATCH',
    body: JSON.stringify({ role }),
  });
  return res.data.user;
}
