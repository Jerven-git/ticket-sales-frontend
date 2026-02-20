<template>
  <div class="min-h-screen bg-light-gray">
    <div class="max-w-2xl mx-auto px-4 py-10">
      <button @click="$router.back()" class="mb-6 text-primary-600 hover:text-primary-700 flex items-center gap-1">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      <h1 class="text-2xl font-bold text-dark-gray mb-6">Checkout</h1>

      <div v-if="loading" class="text-center py-10 text-gray-500">Loading event...</div>

      <div v-else-if="event">
        <!-- Event Summary -->
        <div class="bg-white rounded-lg p-6 shadow-sm mb-6">
          <h2 class="font-semibold text-lg mb-2">{{ event.event_title }}</h2>
          <p class="text-sm text-gray-500">{{ event.event_start_date }} at {{ event.event_start_time }}</p>
        </div>

        <!-- Ticket Selection -->
        <div class="bg-white rounded-lg p-6 shadow-sm mb-6">
          <h3 class="font-semibold text-dark-gray mb-4">Select Tickets</h3>
          <div v-for="ticket in event.tickets" :key="ticket.id" class="flex items-center justify-between border-b py-3 last:border-0">
            <div>
              <p class="font-medium">{{ ticket.ticket_name }}</p>
              <p class="text-sm text-gray-500">{{ ticket.ticket_price === 0 ? 'Free' : '$' + ticket.ticket_price }} each</p>
              <p class="text-xs text-gray-400">{{ ticket.remaining_ticket }} remaining</p>
            </div>
            <div class="flex items-center gap-2">
              <button
                @click="decrementTicket(ticket.id)"
                :disabled="!ticketQuantities[ticket.id]"
                class="w-8 h-8 rounded border flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-30"
              >-</button>
              <span class="w-8 text-center">{{ ticketQuantities[ticket.id] || 0 }}</span>
              <button
                @click="incrementTicket(ticket)"
                :disabled="(ticketQuantities[ticket.id] || 0) >= Math.min(ticket.ticket_per_user, ticket.remaining_ticket)"
                class="w-8 h-8 rounded border flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-30"
              >+</button>
            </div>
          </div>
        </div>

        <!-- Customer Info -->
        <div class="bg-white rounded-lg p-6 shadow-sm mb-6">
          <h3 class="font-semibold text-dark-gray mb-4">Your Information</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm text-gray-600 mb-1">Name</label>
              <input v-model="customerName" type="text" class="w-full border rounded-lg p-2.5 text-sm" />
            </div>
            <div>
              <label class="block text-sm text-gray-600 mb-1">Email</label>
              <input v-model="customerEmail" type="email" class="w-full border rounded-lg p-2.5 text-sm" />
            </div>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="bg-white rounded-lg p-6 shadow-sm mb-6">
          <h3 class="font-semibold text-dark-gray mb-4">Order Summary</h3>
          <div v-for="item in selectedItems" :key="item.ticket_id" class="flex justify-between text-sm py-1">
            <span>{{ item.name }} x {{ item.quantity }}</span>
            <span>${{ (item.price * item.quantity).toFixed(2) }}</span>
          </div>
          <div class="border-t mt-3 pt-3 flex justify-between font-semibold">
            <span>Total</span>
            <span>${{ orderTotal.toFixed(2) }}</span>
          </div>
        </div>

        <!-- Submit -->
        <button
          @click="placeOrder"
          :disabled="submitting || selectedItems.length === 0"
          class="w-full py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 font-medium"
        >
          {{ submitting ? 'Placing Order...' : 'Place Order & Pay' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useEventStore } from '@/store/eventStore';
import { useOrderStore } from '@/store/orderStore';
import { useAuthStore } from '@/store/authLogin';

export default defineComponent({
  name: 'CheckoutPage',
  props: {
    eventId: { type: [String, Number], required: true },
  },
  data() {
    return {
      ticketQuantities: {} as Record<number, number>,
      customerName: '',
      customerEmail: '',
      submitting: false,
    };
  },
  computed: {
    eventStore(): any { return useEventStore(); },
    orderStore(): any { return useOrderStore(); },
    loading(): boolean { return this.eventStore.isLoading; },
    event(): any { return this.eventStore.currentEvent; },
    selectedItems(): { ticket_id: number; name: string; price: number; quantity: number }[] {
      if (!this.event) return [];
      return Object.entries(this.ticketQuantities)
        .filter(([, qty]) => qty > 0)
        .map(([id, qty]) => {
          const ticket = this.event!.tickets.find((t: any) => t.id === Number(id));
          return {
            ticket_id: Number(id),
            name: ticket?.ticket_name || '',
            price: ticket?.ticket_price || 0,
            quantity: qty,
          };
        });
    },
    orderTotal(): number {
      return this.selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    },
  },
  methods: {
    incrementTicket(ticket: any) {
      const current = this.ticketQuantities[ticket.id] || 0;
      if (current < Math.min(ticket.ticket_per_user, ticket.remaining_ticket)) {
        this.ticketQuantities[ticket.id] = current + 1;
      }
    },
    decrementTicket(ticketId: number) {
      const current = this.ticketQuantities[ticketId] || 0;
      if (current > 0) {
        this.ticketQuantities[ticketId] = current - 1;
      }
    },
    async placeOrder() {
      if (this.submitting || this.selectedItems.length === 0) return;
      this.submitting = true;

      try {
        const order = await this.orderStore.createOrder({
          event_id: Number(this.eventId),
          items: this.selectedItems.map(i => ({ ticket_id: i.ticket_id, quantity: i.quantity })),
          customer_email: this.customerEmail,
          customer_name: this.customerName,
        });

        this.$notify({ type: 'success', title: 'Success', text: 'Order placed! Redirecting to payment...' });
        this.$router.push({
          name: 'payment',
          params: { orderNumber: order.order_number },
        });
      } catch (error: any) {
        const msg = error.response?.data?.error || 'Failed to place order';
        const errorText = typeof msg === 'object' ? Object.values(msg).flat().join(', ') : msg;
        this.$notify({ type: 'error', title: 'Error', text: errorText });
      } finally {
        this.submitting = false;
      }
    },
  },
  async mounted() {
    await this.eventStore.fetchEvent(Number(this.eventId));
    const auth = useAuthStore();
    if (auth.getUser) {
      this.customerName = `${auth.getUser.first_name} ${auth.getUser.last_name}`;
      this.customerEmail = auth.getUser.email;
    }
  },
});
</script>
