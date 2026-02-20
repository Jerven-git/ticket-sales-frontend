<template>
  <div class="min-h-screen bg-light-gray">
    <div class="max-w-3xl mx-auto px-4 py-10">
      <button @click="$router.push({ name: 'orders' })" class="mb-6 text-primary-600 hover:text-primary-700 flex items-center gap-1">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Orders
      </button>

      <div v-if="loading" class="text-center py-10 text-gray-500">Loading order...</div>

      <div v-else-if="order">
        <!-- Order Header -->
        <div class="bg-white rounded-lg p-6 shadow-sm mb-6">
          <div class="flex justify-between items-start mb-4">
            <div>
              <h1 class="text-2xl font-bold text-dark-gray">{{ order.order_number }}</h1>
              <p class="text-sm text-gray-500 mt-1">Placed on {{ formatDate(order.created_at) }}</p>
            </div>
            <span
              class="px-3 py-1 text-sm rounded-full"
              :class="order.payment_status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'"
            >
              {{ order.payment_status }}
            </span>
          </div>

          <div class="text-sm text-gray-600">
            <p><strong>Event:</strong> {{ order.event?.event_title }}</p>
            <p><strong>Customer:</strong> {{ order.customer_name }} ({{ order.customer_email }})</p>
          </div>
        </div>

        <!-- Line Items -->
        <div class="bg-white rounded-lg p-6 shadow-sm mb-6">
          <h3 class="font-semibold text-dark-gray mb-4">Items</h3>
          <div v-for="item in order.items" :key="item.id" class="flex justify-between py-2 border-b last:border-0">
            <div>
              <p class="font-medium">{{ item.ticket?.ticket_name }}</p>
              <p class="text-sm text-gray-500">Qty: {{ item.quantity }} x ${{ (item.unit_price / 100).toFixed(2) }}</p>
            </div>
            <span class="font-medium">${{ (item.total_price / 100).toFixed(2) }}</span>
          </div>
          <div class="border-t mt-3 pt-3 flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>${{ (order.total / 100).toFixed(2) }}</span>
          </div>
        </div>

        <!-- Payment action for unpaid orders -->
        <div v-if="order.payment_status === 'unpaid'" class="text-center">
          <button
            @click="goToPayment"
            class="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium"
          >
            Complete Payment
          </button>
        </div>
      </div>

      <div v-else class="text-center py-10 text-gray-500">Order not found</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useOrderStore } from '@/store/orderStore';
import dayjs from 'dayjs';

export default defineComponent({
  name: 'OrderDetail',
  props: {
    orderNumber: { type: String, required: true },
  },
  computed: {
    orderStore(): any { return useOrderStore(); },
    loading(): boolean { return this.orderStore.loading; },
    order(): any { return this.orderStore.currentOrder; },
  },
  methods: {
    formatDate(date: string) { return dayjs(date).format('MMMM D, YYYY h:mm A'); },
    goToPayment() {
      if (this.order) {
        this.$router.push({
          name: 'payment',
          params: { orderNumber: this.order.order_number },
        });
      }
    },
  },
  async mounted() {
    await this.orderStore.fetchOrder(this.orderNumber);
  },
});
</script>
