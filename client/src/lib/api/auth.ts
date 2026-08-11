import { apiRequest } from './client';

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'user' | 'admin';
  createdAt?: string;
}

export interface AuthResponse {
  user: UserProfile;
  accessToken: string;
  refreshToken?: string;
}

export async function loginAPI(credentials: { email: string; password: string }): Promise<AuthResponse> {
  const res = await apiRequest<{ status: string; message: string; data: AuthResponse }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });

  if (typeof window !== 'undefined' && res.data.accessToken) {
    localStorage.setItem('token', res.data.accessToken);
    localStorage.setItem('user', JSON.stringify(res.data.user));
  }

  return res.data;
}

export async function registerAPI(data: { name: string; email: string; password: string }): Promise<AuthResponse> {
  const res = await apiRequest<{ status: string; message: string; data: AuthResponse }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  if (typeof window !== 'undefined' && res.data.accessToken) {
    localStorage.setItem('token', res.data.accessToken);
    localStorage.setItem('user', JSON.stringify(res.data.user));
  }

  return res.data;
}

export async function getMeAPI(): Promise<UserProfile | null> {
  try {
    const res = await apiRequest<{ status: string; data: { user: UserProfile } }>('/auth/me');
    if (typeof window !== 'undefined' && res.data.user) {
      localStorage.setItem('user', JSON.stringify(res.data.user));
    }
    return res.data.user;
  } catch {
    return null;
  }
}

export async function logoutAPI(): Promise<void> {
  try {
    await apiRequest('/auth/logout', { method: 'POST' });
  } catch (err) {
    console.warn('Logout API failed:', err);
  } finally {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }
}

export function getStoredUser(): UserProfile | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('user');
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  return Boolean(localStorage.getItem('token'));
}
