<template>
  <div class="min-h-screen bg-light-gray">
    <div class="max-w-5xl mx-auto px-4 py-8">
      <h1 class="text-2xl font-bold text-dark-gray mb-8">My Orders</h1>

      <div v-if="loading" class="text-center py-10 text-gray-500">Loading orders...</div>

      <div v-else-if="orders.length > 0" class="bg-white rounded-lg shadow overflow-hidden">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order #</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Event</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr
              v-for="order in orders"
              :key="order.id"
              class="hover:bg-gray-50 cursor-pointer"
              @click="$router.push({ name: 'order-detail-view', params: { orderNumber: order.order_number } })"
            >
              <td class="px-6 py-4 text-sm font-medium text-primary-600">{{ order.order_number }}</td>
              <td class="px-6 py-4 text-sm text-gray-700">{{ order.event?.event_title || 'N/A' }}</td>
              <td class="px-6 py-4 text-sm text-gray-700">${{ (order.total / 100).toFixed(2) }}</td>
              <td class="px-6 py-4">
                <span
                  class="px-2 py-1 text-xs rounded-full"
                  :class="statusClass(order.payment_status)"
                >
                  {{ order.payment_status }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">{{ formatDate(order.created_at) }}</td>
            </tr>
          </tbody>
        </table>
        <BasePagination
          :currentPage="pagination.currentPage"
          :lastPage="pagination.lastPage"
          :total="pagination.total"
          :from="pagination.from"
          :to="pagination.to"
          @page-change="(page: number) => orderStore.fetchOrders(page)"
        />
      </div>

      <div v-else class="text-center py-10">
        <p class="text-gray-500 mb-4">You haven't placed any orders yet.</p>
        <router-link :to="{ name: 'events' }" class="text-primary-600 hover:underline">Browse Events</router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useOrderStore } from '@/store/orderStore';
import BasePagination from '@/components/Base/BasePagination.vue';
import dayjs from 'dayjs';

export default defineComponent({
  name: 'OrderHistory',
  components: { BasePagination },
  computed: {
    orderStore(): any { return useOrderStore(); },
    loading(): boolean { return this.orderStore.loading; },
    orders(): any[] { return this.orderStore.orders; },
    pagination(): any { return this.orderStore.pagination; },
  },
  methods: {
    formatDate(date: string) { return dayjs(date).format('MMM D, YYYY'); },
    statusClass(status: string) {
      const map: Record<string, string> = {
        paid: 'bg-green-100 text-green-700',
        unpaid: 'bg-yellow-100 text-yellow-700',
        failed: 'bg-red-100 text-red-700',
        refunded: 'bg-gray-100 text-gray-700',
      };
      return map[status] || 'bg-gray-100 text-gray-700';
    },
  },
  async mounted() {
    await this.orderStore.fetchOrders();
  },
});
</script>
