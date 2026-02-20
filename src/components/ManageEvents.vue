<template>
  <div class="min-h-screen bg-light-gray">
    <div class="max-w-5xl mx-auto px-4 py-8">
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-2xl font-bold text-dark-gray">Manage Events</h1>
        <router-link
          :to="{ name: 'create-event' }"
          class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
        >
          Create New Event
        </router-link>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-10 text-gray-500">Loading events...</div>

      <!-- Events Table -->
      <div v-else-if="events.length > 0" class="bg-white rounded-lg shadow overflow-hidden">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Event</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="event in events" :key="event.id" class="hover:bg-gray-50">
              <td class="px-6 py-4">
                <router-link :to="{ name: 'event-detail', params: { id: event.id } }" class="text-dark-gray font-medium hover:text-primary-600">
                  {{ event.event_title }}
                </router-link>
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">{{ formatDate(event.event_start_date) }}</td>
              <td class="px-6 py-4 text-sm text-gray-500">{{ event.event_category }}</td>
              <td class="px-6 py-4">
                <span
                  class="px-2 py-1 text-xs rounded-full"
                  :class="event.event_type ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'"
                >
                  {{ event.event_type ? 'Online' : 'In-Person' }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <button @click="confirmDelete(event)" class="text-red-600 hover:text-red-800 text-sm">
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- No Events -->
      <div v-else class="text-center py-10">
        <p class="text-gray-500 mb-4">You haven't created any events yet.</p>
        <router-link
          :to="{ name: 'create-event' }"
          class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          Create Your First Event
        </router-link>
      </div>

      <!-- Delete Confirmation Modal -->
      <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 max-w-sm mx-4">
          <h3 class="text-lg font-semibold mb-2">Delete Event</h3>
          <p class="text-gray-600 mb-4">Are you sure you want to delete "{{ eventToDelete?.event_title }}"? This action cannot be undone.</p>
          <div class="flex justify-end gap-3">
            <button @click="showDeleteModal = false" class="px-4 py-2 text-gray-600 hover:text-gray-800">Cancel</button>
            <button @click="deleteEvent" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Delete</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useEventStore } from '@/store/eventStore';
import dayjs from 'dayjs';

export default defineComponent({
  name: 'ManageEvents',
  data() {
    return {
      showDeleteModal: false,
      eventToDelete: null as any,
    };
  },
  computed: {
    eventStore() {
      return useEventStore();
    },
    loading(): boolean {
      return this.eventStore.isLoading;
    },
    events(): any[] {
      return this.eventStore.myEvents;
    },
  },
  methods: {
    formatDate(date: string): string {
      return dayjs(date).format('MMM D, YYYY');
    },
    confirmDelete(event: any) {
      this.eventToDelete = event;
      this.showDeleteModal = true;
    },
    async deleteEvent() {
      if (this.eventToDelete) {
        const success = await this.eventStore.deleteEvent(this.eventToDelete.id);
        if (success) {
          this.$notify({
            type: 'success',
            title: 'Success',
            text: 'Event deleted successfully',
          });
        } else {
          this.$notify({
            type: 'error',
            title: 'Error',
            text: 'Failed to delete event',
          });
        }
      }
      this.showDeleteModal = false;
      this.eventToDelete = null;
    },
  },
  async mounted() {
    await this.eventStore.fetchMyEvents();
  },
});
</script>
