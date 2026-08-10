export interface WishlistItem {
  id: string;
  title: string;
  subtitle?: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  category?: string;
  collectionName?: string;
  rating?: number;
  salesCount?: number;
}

const WISHLIST_KEY = 'batalabandi_wishlist';

export function getWishlist(): WishlistItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(WISHLIST_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to parse wishlist from localStorage:', e);
    return [];
  }
}

export function saveWishlist(items: WishlistItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event('storage'));
  } catch (e) {
    console.error('Failed to save wishlist to localStorage:', e);
  }
}

export function isInWishlist(id: string): boolean {
  const items = getWishlist();
  return items.some((i) => i.id === id);
}

export function toggleWishlist(item: WishlistItem): boolean {
  let items = getWishlist();
  const exists = items.some((i) => i.id === item.id);

  if (exists) {
    items = items.filter((i) => i.id !== item.id);
  } else {
    items.push(item);
  }

  saveWishlist(items);
  return !exists; // Returns true if added, false if removed
}

export function removeFromWishlist(id: string): WishlistItem[] {
  const items = getWishlist().filter((i) => i.id !== id);
  saveWishlist(items);
  return items;
}
