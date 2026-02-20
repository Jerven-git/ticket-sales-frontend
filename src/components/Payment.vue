<template>
  <div class="min-h-screen bg-light-gray">
    <div class="max-w-lg mx-auto px-4 py-10">
      <button @click="$router.back()" class="mb-6 text-primary-600 hover:text-primary-700 flex items-center gap-1">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      <h1 class="text-2xl font-bold text-dark-gray mb-6">Payment</h1>

      <div v-if="loading" class="text-center py-10 text-gray-500">Loading payment...</div>

      <div v-else-if="error" class="text-center py-10">
        <p class="text-red-600 mb-4">{{ error }}</p>
        <button @click="initPayment" class="text-primary-600 hover:underline">Try Again</button>
      </div>

      <div v-else>
        <!-- Order Summary -->
        <div class="bg-white rounded-lg p-6 shadow-sm mb-6">
          <h3 class="font-semibold text-dark-gray mb-2">Order {{ order?.order_number }}</h3>
          <p class="text-gray-600">{{ order?.event?.event_title }}</p>
          <p class="text-lg font-semibold mt-2">${{ order ? (order.total / 100).toFixed(2) : '0.00' }}</p>
        </div>

        <!-- Stripe Payment Element -->
        <div class="bg-white rounded-lg p-6 shadow-sm mb-6">
          <div id="payment-element" class="mb-4"></div>
          <div v-if="paymentError" class="text-red-600 text-sm mb-4">{{ paymentError }}</div>
        </div>

        <button
          @click="submitPayment"
          :disabled="processing"
          class="w-full py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 font-medium"
        >
          {{ processing ? 'Processing...' : 'Pay Now' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useOrderStore } from '@/store/orderStore';
import { loadStripe, Stripe, StripeElements } from '@stripe/stripe-js';

export default defineComponent({
  name: 'PaymentPage',
  props: {
    orderNumber: { type: String, required: true },
  },
  data() {
    return {
      stripe: null as Stripe | null,
      elements: null as StripeElements | null,
      loading: true,
      processing: false,
      error: '',
      paymentError: '',
    };
  },
  computed: {
    orderStore(): any { return useOrderStore(); },
    order(): any { return this.orderStore.currentOrder; },
  },
  methods: {
    async initPayment() {
      this.loading = true;
      this.error = '';

      try {
        await this.orderStore.fetchOrder(this.orderNumber);

        if (!this.order) {
          this.error = 'Order not found';
          return;
        }

        if (this.order.payment_status === 'paid') {
          this.$notify({ type: 'success', title: 'Already Paid', text: 'This order has already been paid.' });
          this.$router.push({ name: 'order-detail-view', params: { orderNumber: this.orderNumber } });
          return;
        }

        const result = await this.orderStore.createPaymentIntent(this.order.id);

        this.stripe = await loadStripe(result.publishable_key);
        if (!this.stripe) {
          this.error = 'Failed to load Stripe';
          return;
        }

        this.elements = this.stripe.elements({
          clientSecret: result.client_secret,
        });

        const paymentElement = this.elements.create('payment');
        paymentElement.mount('#payment-element');
      } catch (err: any) {
        this.error = err.response?.data?.error || 'Failed to initialize payment';
      } finally {
        this.loading = false;
      }
    },

    async submitPayment() {
      if (!this.stripe || !this.elements || this.processing) return;

      this.processing = true;
      this.paymentError = '';

      const { error } = await this.stripe.confirmPayment({
        elements: this.elements,
        confirmParams: {
          return_url: `${window.location.origin}/orders/${this.orderNumber}`,
        },
      });

      if (error) {
        this.paymentError = error.message || 'Payment failed';
        this.processing = false;
      }
    },
  },
  async mounted() {
    await this.initPayment();
  },
});
</script>
