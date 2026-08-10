import { apiRequest } from './client';

export interface RazorpayOrderResponse {
  keyId: string;
  razorpayOrderId: string;
  amount: number;
  currency: string;
  orderId: string;
}

export interface VerifyPaymentPayload {
  orderId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

/**
 * Dynamically load Razorpay SDK Script into the DOM
 */
export function loadRazorpaySDK(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      return resolve(false);
    }
    if ((window as any).Razorpay) {
      return resolve(true);
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

/**
 * Call backend to generate Razorpay order securely
 */
export async function createRazorpayOrderAPI(orderId: string): Promise<RazorpayOrderResponse> {
  const res = await apiRequest<{ status: string; data: RazorpayOrderResponse }>('/payments/create-order', {
    method: 'POST',
    body: JSON.stringify({ orderId }),
  });
  return res.data;
}

/**
 * Cryptographically verify payment on server
 */
export async function verifyPaymentAPI(payload: VerifyPaymentPayload): Promise<any> {
  const res = await apiRequest<{ status: string; message: string; data: any }>('/payments/verify', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return res.data;
}
