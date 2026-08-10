const getApiBaseUrl = (): string => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  if (typeof window !== 'undefined') {
    return `http://${window.location.hostname}:5000/api/v1`;
  }
  return 'http://localhost:5000/api/v1';
};

export const API_BASE_URL = getApiBaseUrl();

export async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const baseUrl = getApiBaseUrl();
  const cleanEndpoint = endpoint.startsWith('/api/v1') ? endpoint.replace('/api/v1', '') : endpoint;
  const url = `${baseUrl}${cleanEndpoint}`;
  
  let token = '';
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('token') || localStorage.getItem('adminToken') || '';
  }

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ message: 'API request failed' }));
      throw new Error(errorData.message || `HTTP ${res.status}`);
    }

    return await res.json();
  } catch (error: any) {
    console.warn(`[API] ${endpoint} failed:`, error.message);
    throw error;
  }
}

export async function uploadFile(file: File): Promise<string> {
  const baseUrl = getApiBaseUrl();
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${baseUrl}/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    throw new Error('Image upload failed');
  }

  const data = await res.json();
  return `${baseUrl.replace('/api/v1', '')}${data.data.url}`;
}

export function formatImageUrl(url?: string): string {
  if (!url) return '';
  if (typeof window !== 'undefined') {
    if (url.includes('localhost:5000')) {
      return url.replace('localhost', window.location.hostname);
    }
    if (url.startsWith('/uploads')) {
      return `http://${window.location.hostname}:5000${url}`;
    }
  }
  if (url.startsWith('/uploads')) {
    return `http://localhost:5000${url}`;
  }
  return url;
}
