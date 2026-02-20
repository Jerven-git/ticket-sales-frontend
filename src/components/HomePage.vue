<template>
  <div class="min-h-screen">
    <!-- Hero Section -->
    <div class="relative bg-dark-gray h-96 flex items-center justify-center overflow-hidden">
      <img class="absolute inset-0 w-full h-full object-cover opacity-50" src="@/assets/images/audience.jpg" alt="Audience Image">
      <div class="relative z-10 text-center text-white px-4">
        <h1 class="text-5xl font-bold mb-4">Discover Amazing Events</h1>
        <p class="text-xl mb-8">Find and book tickets for the best events near you</p>
        <div class="flex items-center gap-4 max-w-lg mx-auto">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Search events..."
            class="flex-1 px-4 py-3 rounded-lg text-dark-gray focus:outline-none focus:ring-2 focus:ring-primary-500"
            @keyup.enter="handleSearch"
          />
          <button
            @click="handleSearch"
            class="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
          >
            Search
          </button>
        </div>
      </div>
    </div>

    <!-- Upcoming Events Section -->
    <div class="max-w-7xl mx-auto px-4 py-12">
      <div class="flex items-center justify-between mb-8">
        <h2 class="text-3xl font-bold text-dark-gray">Upcoming Events</h2>
        <router-link :to="{ name: 'events' }" class="text-primary-600 hover:text-primary-700 font-medium">
          View All
        </router-link>
      </div>

      <div v-if="loading" class="text-center py-10 text-gray-500">Loading events...</div>

      <div v-else-if="upcomingEvents.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <EventCard v-for="event in upcomingEvents.slice(0, 4)" :key="event.id" :event="event" />
      </div>

      <div v-else class="text-center py-10">
        <p class="text-gray-500 text-lg mb-4">No upcoming events</p>
        <router-link
          :to="{ name: 'create-event' }"
          class="text-primary-600 hover:text-primary-700 font-medium"
        >
          Be the first to create an event
        </router-link>
      </div>
    </div>

    <!-- Browse by Category -->
    <div class="bg-white py-12">
      <div class="max-w-7xl mx-auto px-4">
        <h2 class="text-3xl font-bold text-center text-dark-gray mb-8">Browse by Category</h2>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
          <router-link
            v-for="category in categories"
            :key="category.name"
            :to="{ name: 'events', query: { category: category.name } }"
            class="flex items-center justify-center bg-light-gray h-20 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
          >
            <span class="text-lg font-medium text-dark-gray">{{ category.name }}</span>
          </router-link>
        </div>
      </div>
    </div>

    <!-- CTA Section -->
    <div class="bg-primary-600 py-12">
      <div class="max-w-3xl mx-auto text-center px-4">
        <h2 class="text-3xl font-bold text-white mb-4">Ready to host your own event?</h2>
        <p class="text-primary-100 mb-6">Create and manage your events with our easy-to-use platform</p>
        <router-link
          :to="{ name: 'create-event' }"
          class="inline-block px-8 py-3 bg-white text-primary-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
        >
          Create Event
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useEventStore } from '@/store/eventStore';
import EventCard from '@/components/EventCard.vue';

export default defineComponent({
  name: 'HomePage',
  components: { EventCard },
  data() {
    return {
      searchQuery: '',
      categories: [
        { name: 'Music' },
        { name: 'Sports' },
        { name: 'Tournament' },
      ],
    };
  },
  computed: {
    eventStore() {
      return useEventStore();
    },
    loading(): boolean {
      return this.eventStore.isLoading;
    },
    upcomingEvents(): any[] {
      return this.eventStore.events;
    },
  },
  methods: {
    handleSearch() {
      if (this.searchQuery.trim()) {
        this.$router.push({ name: 'events', query: { q: this.searchQuery } });
      }
    },
  },
  async mounted() {
    await this.eventStore.fetchEvents({ upcoming: 'true' });
  },
});
</script>
