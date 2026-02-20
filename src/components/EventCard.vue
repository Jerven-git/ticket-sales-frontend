<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" @click="goToEvent">
    <div class="h-48 bg-gray-200 flex items-center justify-center overflow-hidden">
      <img
        v-if="event.media && event.media.length > 0"
        :src="mediaUrl(event.media[0].path)"
        :alt="event.event_title"
        class="w-full h-full object-cover"
      />
      <div v-else class="text-gray-400 text-sm">No Image</div>
    </div>
    <div class="p-4">
      <div class="flex items-center justify-between mb-2">
        <span class="text-xs font-semibold text-primary-600 uppercase">{{ event.event_category }}</span>
        <span
          class="text-xs px-2 py-1 rounded-full"
          :class="event.event_type ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'"
        >
          {{ event.event_type ? 'Online' : 'In-Person' }}
        </span>
      </div>
      <h3 class="text-lg font-semibold text-dark-gray mb-1 truncate">{{ event.event_title }}</h3>
      <p class="text-sm text-gray-500 mb-2">{{ formatDate(event.event_start_date) }} at {{ event.event_start_time }}</p>
      <p class="text-sm text-gray-600 mb-3 truncate">{{ event.event_location || event.event_link || 'TBA' }}</p>
      <div class="flex items-center justify-between">
        <span class="text-sm text-gray-500">By {{ event.organizer?.organizer_name || 'Unknown' }}</span>
        <span v-if="lowestPrice !== null" class="text-sm font-semibold text-primary-600">
          {{ lowestPrice === 0 ? 'Free' : '$' + lowestPrice }}
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import dayjs from 'dayjs';

export default defineComponent({
  name: 'EventCard',
  props: {
    event: {
      type: Object as PropType<any>,
      required: true,
    },
  },
  computed: {
    lowestPrice(): number | null {
      if (!this.event.tickets || this.event.tickets.length === 0) return null;
      return Math.min(...this.event.tickets.map((t: any) => t.ticket_price));
    },
  },
  methods: {
    formatDate(date: string): string {
      return dayjs(date).format('MMM D, YYYY');
    },
    mediaUrl(path: string): string {
      const baseUrl = process.env.VUE_APP_BASE_URL || 'http://localhost:8000';
      return `${baseUrl}/storage/${path}`;
    },
    goToEvent() {
      this.$router.push({ name: 'event-detail', params: { id: this.event.id } });
    },
  },
});
</script>
