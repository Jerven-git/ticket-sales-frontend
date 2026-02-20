<template>
  <div class="min-h-screen bg-light-gray">
    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-20">
      <div class="text-gray-500 text-lg">Loading event...</div>
    </div>

    <!-- Event Content -->
    <div v-else-if="event" class="max-w-5xl mx-auto px-4 py-8">
      <!-- Back Button -->
      <button @click="$router.back()" class="mb-6 text-primary-600 hover:text-primary-700 flex items-center gap-1">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      <!-- Event Header Image -->
      <div class="bg-gray-200 h-64 md:h-96 rounded-lg overflow-hidden mb-8">
        <img
          v-if="event.media && event.media.length > 0"
          :src="mediaUrl(event.media[0].path)"
          :alt="event.event_title"
          class="w-full h-full object-cover"
        />
        <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
          No Event Image
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Main Content -->
        <div class="md:col-span-2">
          <!-- Title & Category -->
          <div class="mb-4">
            <span class="text-sm font-semibold text-primary-600 uppercase">{{ event.event_category }} / {{ event.event_sub_category }}</span>
          </div>
          <h1 class="text-3xl font-bold text-dark-gray mb-4">{{ event.event_title }}</h1>

          <!-- Date & Time -->
          <div class="bg-white rounded-lg p-4 mb-6 shadow-sm">
            <h3 class="font-semibold text-dark-gray mb-3">Date and Time</h3>
            <div class="flex items-center gap-2 text-gray-600 mb-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{{ formatDate(event.event_start_date) }} at {{ event.event_start_time }}</span>
            </div>
            <div class="flex items-center gap-2 text-gray-600">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Ends {{ formatDate(event.event_end_date) }} at {{ event.event_end_time }}</span>
            </div>
          </div>

          <!-- Location -->
          <div class="bg-white rounded-lg p-4 mb-6 shadow-sm">
            <h3 class="font-semibold text-dark-gray mb-3">Location</h3>
            <div v-if="event.event_type" class="text-gray-600">
              <span class="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm mb-2">Online Event</span>
              <p v-if="event.event_link">
                <a :href="event.event_link" target="_blank" class="text-primary-600 hover:underline">{{ event.event_link }}</a>
              </p>
              <p v-if="event.event_note" class="mt-2 text-sm text-gray-500">{{ event.event_note }}</p>
            </div>
            <div v-else class="text-gray-600">
              <span class="inline-block px-2 py-1 bg-green-100 text-green-700 rounded text-sm mb-2">In-Person</span>
              <p>{{ event.event_location || 'Location TBA' }}</p>
            </div>
          </div>

          <!-- Description -->
          <div class="bg-white rounded-lg p-4 mb-6 shadow-sm">
            <h3 class="font-semibold text-dark-gray mb-3">About this event</h3>
            <div class="text-gray-600 prose max-w-none" v-html="event.event_description"></div>
          </div>

          <!-- Refund Policy -->
          <div class="bg-white rounded-lg p-4 mb-6 shadow-sm">
            <h3 class="font-semibold text-dark-gray mb-3">Refund Policy</h3>
            <p class="text-gray-600">{{ event.event_refund }}</p>
          </div>

          <!-- Organizer -->
          <div class="bg-white rounded-lg p-4 shadow-sm">
            <h3 class="font-semibold text-dark-gray mb-3">Organized by</h3>
            <p class="text-gray-600 font-medium">{{ event.organizer?.organizer_name || 'Unknown' }}</p>
          </div>
        </div>

        <!-- Sidebar - Tickets -->
        <div class="md:col-span-1">
          <div class="bg-white rounded-lg p-6 shadow-sm sticky top-24">
            <h3 class="font-semibold text-dark-gray mb-4 text-lg">Tickets</h3>
            <div v-if="event.tickets && event.tickets.length > 0">
              <div
                v-for="ticket in event.tickets"
                :key="ticket.id"
                class="border rounded-lg p-4 mb-3"
                :class="ticket.remaining_ticket > 0 ? 'border-gray-200' : 'border-red-200 bg-red-50'"
              >
                <div class="flex justify-between items-start mb-2">
                  <h4 class="font-medium text-dark-gray">{{ ticket.ticket_name }}</h4>
                  <span class="font-semibold text-primary-600">
                    {{ ticket.ticket_price === 0 ? 'Free' : '$' + ticket.ticket_price }}
                  </span>
                </div>
                <p v-if="ticket.ticket_description" class="text-sm text-gray-500 mb-2">{{ ticket.ticket_description }}</p>
                <div class="flex justify-between items-center text-sm">
                  <span class="text-gray-500">{{ ticket.remaining_ticket }} remaining</span>
                  <span class="text-gray-400">Max {{ ticket.ticket_per_user }} per user</span>
                </div>
                <div v-if="ticket.remaining_ticket <= 0" class="mt-2 text-red-600 text-sm font-medium">Sold Out</div>
              </div>
              <button
                @click="buyTickets"
                :disabled="!hasAvailableTickets"
                class="w-full mt-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 font-medium"
              >
                Buy Tickets
              </button>
            </div>
            <div v-else class="text-gray-500 text-center py-4">
              No tickets available
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Not Found -->
    <div v-else class="flex flex-col items-center justify-center py-20">
      <p class="text-gray-500 text-lg">Event not found</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useEventStore } from '@/store/eventStore';
import dayjs from 'dayjs';

export default defineComponent({
  name: 'EventDetail',
  props: {
    id: {
      type: [String, Number],
      required: true,
    },
  },
  computed: {
    eventStore() {
      return useEventStore();
    },
    loading(): boolean {
      return this.eventStore.isLoading;
    },
    event(): any {
      return this.eventStore.currentEvent;
    },
    hasAvailableTickets(): boolean {
      if (!this.event?.tickets) return false;
      return this.event.tickets.some((t: any) => t.remaining_ticket > 0);
    },
  },
  methods: {
    formatDate(date: string): string {
      return dayjs(date).format('MMMM D, YYYY');
    },
    mediaUrl(path: string): string {
      const baseUrl = process.env.VUE_APP_BASE_URL || 'http://localhost:8000';
      return `${baseUrl}/storage/${path}`;
    },
    buyTickets() {
      this.$router.push({ name: 'checkout', params: { eventId: String(this.event.id) } });
    },
  },
  async mounted() {
    await this.eventStore.fetchEvent(Number(this.id));
  },
});
</script>
