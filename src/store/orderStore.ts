import { defineStore } from 'pinia';
import { axiosInstance } from '@/axios/axios';

export interface OrderItem {
  id: number;
  event_ticket_id: number;
  quantity: number;
  unit_price: number;
  total_price: number;
  ticket: {
    id: number;
    ticket_name: string;
    ticket_price: number;
  };
}

export interface Order {
  id: number;
  order_number: string;
  status: string;
  payment_status: string;
  stripe_payment_intent_id: string | null;
  subtotal: number;
  total: number;
  currency: string;
  customer_email: string;
  customer_name: string;
  items: OrderItem[];
  event: any;
  created_at: string;
  paid_at: string | null;
}

export const useOrderStore = defineStore('order', {
  state: () => ({
    orders: [] as Order[],
    currentOrder: null as Order | null,
    loading: false,
    pagination: {
      currentPage: 1,
      lastPage: 1,
      total: 0,
      from: 0,
      to: 0,
    },
  }),
  actions: {
    async createOrder(payload: {
      event_id: number;
      items: { ticket_id: number; quantity: number }[];
      customer_email: string;
      customer_name: string;
    }) {
      this.loading = true;
      try {
        const response = await axiosInstance.post('/v1/orders', payload);
        this.currentOrder = response.data.data;
        return response.data.data;
      } catch (error) {
        console.error('Failed to create order:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchOrders(page = 1) {
      this.loading = true;
      try {
        const response = await axiosInstance.get(`/v1/orders?page=${page}`);
        const paginated = response.data.data;
        this.orders = paginated.data;
        this.pagination = {
          currentPage: paginated.current_page,
          lastPage: paginated.last_page,
          total: paginated.total,
          from: paginated.from ?? 0,
          to: paginated.to ?? 0,
        };
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        this.loading = false;
      }
    },

    async fetchOrder(orderNumber: string) {
      this.loading = true;
      try {
        const response = await axiosInstance.get(`/v1/orders/${orderNumber}`);
        this.currentOrder = response.data.data;
      } catch (error) {
        console.error('Failed to fetch order:', error);
      } finally {
        this.loading = false;
      }
    },

    async createPaymentIntent(orderId: number) {
      const response = await axiosInstance.post('/v1/payments/create-intent', {
        order_id: orderId,
      });
      return response.data.data;
    },
  },
});
