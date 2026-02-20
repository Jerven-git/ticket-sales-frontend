<template>
  <div class="min-h-screen bg-light-gray">
    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- Search Bar -->
      <div class="mb-8">
        <div class="flex items-center gap-4">
          <div class="flex-1 relative">
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Search events..."
              class="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              @keyup.enter="handleSearch"
            />
            <svg class="absolute left-3 top-3.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <button
            @click="handleSearch"
            class="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Search
          </button>
        </div>
      </div>

      <!-- Category Filter -->
      <div class="mb-6 flex flex-wrap gap-2">
        <button
          v-for="category in categories"
          :key="category"
          @click="filterByCategory(category)"
          class="px-4 py-2 rounded-full text-sm font-medium transition-colors"
          :class="selectedCategory === category ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-300'"
        >
          {{ category }}
        </button>
        <button
          @click="clearFilter"
          v-if="selectedCategory"
          class="px-4 py-2 rounded-full text-sm font-medium bg-gray-200 text-gray-600 hover:bg-gray-300"
        >
          Clear Filter
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center py-20">
        <div class="text-gray-500 text-lg">Loading events...</div>
      </div>

      <!-- Events Grid -->
      <div v-else-if="displayEvents.length > 0">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <EventCard v-for="event in displayEvents" :key="event.id" :event="event" />
        </div>
        <BasePagination
          :currentPage="currentPagination.currentPage"
          :lastPage="currentPagination.lastPage"
          :total="currentPagination.total"
          :from="currentPagination.from"
          :to="currentPagination.to"
          @page-change="handlePageChange"
        />
      </div>

      <!-- No Events -->
      <div v-else class="flex flex-col items-center justify-center py-20">
        <p class="text-gray-500 text-lg mb-4">No events found</p>
        <router-link
          :to="{ name: 'create-event' }"
          class="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          Create an Event
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useEventStore } from '@/store/eventStore';
import EventCard from '@/components/EventCard.vue';
import BasePagination from '@/components/Base/BasePagination.vue';

export default defineComponent({
  name: 'EventList',
  components: { EventCard, BasePagination },
  data() {
    return {
      searchQuery: '',
      selectedCategory: '',
      categories: ['Music', 'Sports', 'Tournament'],
      isSearching: false,
    };
  },
  computed: {
    eventStore() {
      return useEventStore();
    },
    loading(): boolean {
      return this.eventStore.isLoading;
    },
    displayEvents(): any[] {
      if (this.isSearching) {
        return this.eventStore.searchResults;
      }
      return this.eventStore.events;
    },
    currentPagination(): any {
      if (this.isSearching) {
        return this.eventStore.searchPagination;
      }
      return this.eventStore.pagination;
    },
  },
  methods: {
    async handleSearch() {
      if (this.searchQuery.trim()) {
        this.isSearching = true;
        this.selectedCategory = '';
        await this.eventStore.searchEvents(this.searchQuery);
      } else {
        this.isSearching = false;
        await this.eventStore.fetchEvents();
      }
    },
    async filterByCategory(category: string) {
      this.selectedCategory = category;
      this.isSearching = false;
      this.searchQuery = '';
      await this.eventStore.fetchEvents({ category });
    },
    async clearFilter() {
      this.selectedCategory = '';
      this.isSearching = false;
      this.searchQuery = '';
      await this.eventStore.fetchEvents();
    },
    async handlePageChange(page: number) {
      if (this.isSearching) {
        await this.eventStore.searchEvents(this.searchQuery, page);
      } else {
        const filters: Record<string, string> = {};
        if (this.selectedCategory) filters.category = this.selectedCategory;
        await this.eventStore.fetchEvents(filters, page);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
  },
  async mounted() {
    await this.eventStore.fetchEvents();
  },
});
</script>
