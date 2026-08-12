import { apiRequest, API_BASE_URL } from './client';

export interface ReviewItem {
  _id: string;
  id?: string;
  productId: string;
  userName: string;
  userEmail?: string;
  rating: number;
  title?: string;
  comment: string;
  photos: string[];
  verifiedPurchase: boolean;
  helpfulCount: number;
  createdAt: string;
}

export interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  ratingCounts: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  allPhotos: string[];
}

export interface FetchReviewsResponse {
  status: string;
  results: number;
  stats: ReviewStats;
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
    totalItems: number;
  };
  data: {
    reviews: ReviewItem[];
  };
}

export interface CreateReviewPayload {
  userName: string;
  userEmail?: string;
  rating: number;
  title?: string;
  comment: string;
  photos?: string[];
}

/**
 * Fetch reviews and statistics for a specific product
 */
export async function fetchProductReviewsAPI(
  productId: string,
  params: {
    hasPhotos?: boolean;
    rating?: number;
    sortBy?: 'newest' | 'rating_high' | 'rating_low' | 'helpful';
    page?: number;
    limit?: number;
  } = {}
): Promise<FetchReviewsResponse> {
  const queryParts: string[] = [];
  if (params.hasPhotos) queryParts.push('hasPhotos=true');
  if (params.rating) queryParts.push(`rating=${params.rating}`);
  if (params.sortBy) queryParts.push(`sortBy=${params.sortBy}`);
  if (params.page) queryParts.push(`page=${params.page}`);
  if (params.limit) queryParts.push(`limit=${params.limit}`);

  const queryString = queryParts.length > 0 ? `?${queryParts.join('&')}` : '';

  return apiRequest<FetchReviewsResponse>(`/reviews/product/${productId}${queryString}`);
}

/**
 * Submit a new product review with optional photo URLs
 */
export async function createProductReviewAPI(
  productId: string,
  payload: CreateReviewPayload
): Promise<{ status: string; message: string; data: { review: ReviewItem } }> {
  return apiRequest<{ status: string; message: string; data: { review: ReviewItem } }>(
    `/reviews/product/${productId}`,
    {
      method: 'POST',
      body: JSON.stringify(payload),
    }
  );
}

/**
 * Upload multiple photo files for a customer review
 */
export async function uploadReviewPhotosAPI(files: File[]): Promise<string[]> {
  if (files.length === 0) return [];

  const baseUrl = API_BASE_URL;
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('photos', file);
  });

  const res = await fetch(`${baseUrl}/upload/multiple`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || 'Failed to upload review photos');
  }

  const data = await res.json();
  const rawUrls: string[] = data.data.urls || [];

  const serverHost = baseUrl.replace('/api/v1', '');
  return rawUrls.map((url) => (url.startsWith('/') ? `${serverHost}${url}` : url));
}

/**
 * Vote a review as helpful
 */
export async function markReviewHelpfulAPI(reviewId: string): Promise<ReviewItem> {
  const res = await apiRequest<{ data: { review: ReviewItem } }>(`/reviews/${reviewId}/helpful`, {
    method: 'POST',
  });
  return res.data.review;
}

/**
 * Admin: Fetch all reviews across all products
 */
export async function fetchAllReviewsAPI(params: {
  status?: string;
  rating?: number;
  page?: number;
  limit?: number;
} = {}): Promise<{
  data: { reviews: ReviewItem[] };
  pagination: { page: number; limit: number; totalPages: number; totalItems: number };
}> {
  const queryParts: string[] = [];
  if (params.status) queryParts.push(`status=${params.status}`);
  if (params.rating) queryParts.push(`rating=${params.rating}`);
  if (params.page) queryParts.push(`page=${params.page}`);
  if (params.limit) queryParts.push(`limit=${params.limit}`);

  const queryString = queryParts.length > 0 ? `?${queryParts.join('&')}` : '';
  return apiRequest(`/reviews${queryString}`);
}

/**
 * Admin: Delete a review
 */
export async function deleteReviewAPI(reviewId: string): Promise<boolean> {
  await apiRequest(`/reviews/${reviewId}`, {
    method: 'DELETE',
  });
  return true;
}
