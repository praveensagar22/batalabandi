import { apiRequest } from './client';

export interface CreateOrderPayload {
  orderItems: {
    product: string;
    title: string;
    price: number;
    quantity: number;
    image?: string;
  }[];
  shippingAddress: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: string;
  totalAmount: number;
}

export interface OrderResponse {
  _id: string;
  user?: string;
  orderItems: {
    product: string;
    title: string;
    price: number;
    quantity: number;
    image?: string;
  }[];
  shippingAddress: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: string;
  paymentStatus: 'Pending' | 'Paid' | 'Failed';
  orderStatus: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  totalAmount: number;
  createdAt: string;
}

export async function createOrderAPI(payload: CreateOrderPayload): Promise<OrderResponse> {
  const res = await apiRequest<{ status: string; data: { order: OrderResponse } }>('/orders', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return res.data.order;
}

export async function getMyOrdersAPI(): Promise<OrderResponse[]> {
  const res = await apiRequest<{ status: string; data: { orders: OrderResponse[] } }>('/orders/my-orders');
  return res.data.orders;
}

export async function getOrderByIdAPI(id: string): Promise<OrderResponse> {
  const res = await apiRequest<{ status: string; data: { order: OrderResponse } }>(`/orders/${id}`);
  return res.data.order;
}
