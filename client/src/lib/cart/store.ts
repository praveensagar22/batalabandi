import { apiRequest } from '../api/client';

export interface CartItem {
  id: string;
  productId: string;
  title: string;
  subtitle?: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  color?: string;
  size?: string;
  quantity: number;
}

export interface BackendCartCalculation {
  items: Array<{
    id: string;
    productId: string;
    title: string;
    subtitle?: string;
    price: number;
    compareAtPrice?: number;
    image: string;
    color?: string;
    size?: string;
    quantity: number;
    itemSubtotal: number;
    itemOriginalTotal: number;
    inStock: boolean;
  }>;
  summary: {
    itemCount: number;
    originalTotal: number;
    subtotal: number;
    productDiscount: number;
    couponDiscount: number;
    shippingFee: number;
    isFreeShipping: boolean;
    freeShippingThreshold: number;
    amountForFreeShipping: number;
    finalTotal: number;
  };
  coupon: {
    code: string;
    isValid: boolean;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    discountAmount: number;
    message: string;
  } | null;
}

const CART_KEY = 'batalabandi_cart';
const SESSION_KEY = 'batalabandi_session_id';

export function getSessionId(): string {
  if (typeof window === 'undefined') return 'server-session';
  let sId = localStorage.getItem(SESSION_KEY);
  if (!sId) {
    sId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem(SESSION_KEY, sId);
  }
  return sId;
}

export function getLocalCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function saveLocalCart(items: CartItem[], notify = false): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
    if (notify) {
      window.dispatchEvent(new CustomEvent('cart-updated'));
    }
  } catch (e) {
    console.error('Failed to save cart:', e);
  }
}

/**
 * Fetch Cart directly from MongoDB Backend Database (without triggering recursive event loops)
 */
export async function getCart(): Promise<CartItem[]> {
  const sessionId = getSessionId();
  try {
    const res = await apiRequest<{ data: { cart: { items: any[] } } }>(`/cart?sessionId=${sessionId}`, {
      method: 'GET',
      headers: { 'x-session-id': sessionId },
    });

    if (res?.data?.cart?.items) {
      const formattedItems: CartItem[] = res.data.cart.items.map((i: any) => ({
        id: i._id ? i._id.toString() : i.productId.toString(),
        productId: i.productId.toString(),
        title: i.title,
        subtitle: i.subtitle,
        price: i.price,
        image: i.image,
        color: i.color || 'Standard',
        size: i.size || 'M',
        quantity: i.quantity || 1,
      }));

      saveLocalCart(formattedItems, false); // Do not trigger notification loops on read
      return formattedItems;
    }
  } catch (err) {
    console.warn('Falling back to local cart cache:', err);
  }
  return getLocalCart();
}

/**
 * Add Item directly to MongoDB Backend Cart Database
 */
export async function addToCart(itemData: Omit<CartItem, 'id'>): Promise<CartItem[]> {
  const sessionId = getSessionId();

  // Optimistic update
  const current = getLocalCart();
  const existingIdx = current.findIndex(
    (i) => i.productId === itemData.productId && i.color === itemData.color && i.size === itemData.size
  );

  if (existingIdx > -1) {
    current[existingIdx].quantity += itemData.quantity || 1;
  } else {
    current.push({
      ...itemData,
      id: `${itemData.productId}-${itemData.color || 'def'}-${itemData.size || 'def'}`,
      quantity: itemData.quantity || 1,
    });
  }
  saveLocalCart(current, true);

  // Sync to MongoDB database
  try {
    await apiRequest('/cart/items', {
      method: 'POST',
      headers: { 'x-session-id': sessionId },
      body: JSON.stringify({
        sessionId,
        productId: itemData.productId,
        quantity: itemData.quantity || 1,
        color: itemData.color || 'Standard',
        size: itemData.size || 'M',
      }),
    });
    return await getCart();
  } catch (err) {
    console.error('Failed to sync add to cart with MongoDB backend:', err);
    return current;
  }
}

/**
 * Update Quantity directly in MongoDB Backend Cart Database
 */
export async function updateQuantity(id: string, quantity: number): Promise<CartItem[]> {
  const sessionId = getSessionId();

  // Optimistic update
  let current = getLocalCart();
  if (quantity <= 0) {
    current = current.filter((i) => i.id !== id && i.productId !== id);
  } else {
    const found = current.find((i) => i.id === id || i.productId === id);
    if (found) found.quantity = quantity;
  }
  saveLocalCart(current, true);

  // Sync to MongoDB database
  try {
    await apiRequest(`/cart/items/${id}`, {
      method: 'PATCH',
      headers: { 'x-session-id': sessionId },
      body: JSON.stringify({ sessionId, quantity }),
    });
    return await getCart();
  } catch (err) {
    console.error('Failed to sync update quantity with MongoDB backend:', err);
    return current;
  }
}

/**
 * Remove Item directly from MongoDB Backend Cart Database
 */
export async function removeFromCart(id: string): Promise<CartItem[]> {
  const sessionId = getSessionId();

  const current = getLocalCart().filter((i) => i.id !== id && i.productId !== id);
  saveLocalCart(current, true);

  try {
    await apiRequest(`/cart/items/${id}?sessionId=${sessionId}`, {
      method: 'DELETE',
      headers: { 'x-session-id': sessionId },
    });
    return await getCart();
  } catch (err) {
    console.error('Failed to remove item from MongoDB cart:', err);
    return current;
  }
}

/**
 * Clear MongoDB Backend Cart Database
 */
export async function clearCart(): Promise<void> {
  const sessionId = getSessionId();
  saveLocalCart([], true);

  try {
    await apiRequest(`/cart?sessionId=${sessionId}`, {
      method: 'DELETE',
      headers: { 'x-session-id': sessionId },
    });
  } catch (err) {
    console.error('Failed to clear MongoDB backend cart:', err);
  }
}

/**
 * Perform 100% Backend Server-Side Cart Calculation from MongoDB
 */
export async function calculateBackendCartAPI(
  items: CartItem[],
  couponCode?: string
): Promise<BackendCartCalculation> {
  const sessionId = getSessionId();
  const inputItems = items.map((i) => ({
    productId: i.productId,
    quantity: i.quantity,
    color: i.color,
    size: i.size,
  }));

  const res = await apiRequest<{ data: BackendCartCalculation }>('/cart/calculate', {
    method: 'POST',
    headers: { 'x-session-id': sessionId },
    body: JSON.stringify({ sessionId, items: inputItems, couponCode }),
  });

  return res.data;
}
