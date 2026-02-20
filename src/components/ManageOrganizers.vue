<template>
  <div class="min-h-screen bg-light-gray">
    <div class="max-w-5xl mx-auto px-4 py-8">
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-2xl font-bold text-dark-gray">Manage Organizers</h1>
        <button
          @click="showCreateForm = true"
          class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
        >
          Add Organizer
        </button>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-10 text-gray-500">Loading organizers...</div>

      <!-- Organizers List -->
      <div v-else-if="organizers.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div v-for="organizer in organizers" :key="organizer.id" class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex items-start justify-between">
            <div>
              <h3 class="text-lg font-semibold text-dark-gray">{{ organizer.organizer_name }}</h3>
              <p v-if="organizer.organizer_website" class="text-sm text-primary-600 mt-1">
                <a :href="organizer.organizer_website" target="_blank" class="hover:underline">{{ organizer.organizer_website }}</a>
              </p>
              <p v-if="organizer.organizer_bio" class="text-sm text-gray-600 mt-2">{{ organizer.organizer_bio }}</p>
              <div class="flex gap-3 mt-3">
                <a v-if="organizer.organizer_facebook_link" :href="organizer.organizer_facebook_link" target="_blank" class="text-blue-600 text-sm hover:underline">Facebook</a>
                <a v-if="organizer.organizer_twitter_link" :href="organizer.organizer_twitter_link" target="_blank" class="text-blue-400 text-sm hover:underline">Twitter</a>
                <a v-if="organizer.organizer_instagram_link" :href="organizer.organizer_instagram_link" target="_blank" class="text-pink-600 text-sm hover:underline">Instagram</a>
              </div>
            </div>
            <button @click="confirmDelete(organizer)" class="text-red-600 hover:text-red-800 text-sm ml-4">Delete</button>
          </div>
        </div>
      </div>

      <!-- No Organizers -->
      <div v-else class="text-center py-10">
        <p class="text-gray-500 mb-4">No organizers found.</p>
        <button
          @click="showCreateForm = true"
          class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          Add Your First Organizer
        </button>
      </div>

      <!-- Create Organizer Modal -->
      <div v-if="showCreateForm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
        <div class="bg-white rounded-lg p-6 max-w-md mx-4 my-8 w-full">
          <h3 class="text-lg font-semibold mb-4">Add Organizer</h3>
          <form @submit.prevent="createOrganizer" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input v-model="form.organizer_name" type="text" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Website</label>
              <input v-model="form.organizer_website" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Bio</label>
              <textarea v-model="form.organizer_bio" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Facebook</label>
              <input v-model="form.organizer_facebook_link" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Twitter</label>
              <input v-model="form.organizer_twitter_link" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
              <input v-model="form.organizer_instagram_link" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Photo</label>
              <input type="file" @change="handlePhoto" accept="image/*" class="w-full text-sm" />
            </div>
            <div class="flex justify-end gap-3 pt-2">
              <button type="button" @click="showCreateForm = false" class="px-4 py-2 text-gray-600 hover:text-gray-800">Cancel</button>
              <button type="submit" class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">Create</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Delete Confirmation Modal -->
      <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 max-w-sm mx-4">
          <h3 class="text-lg font-semibold mb-2">Delete Organizer</h3>
          <p class="text-gray-600 mb-4">Are you sure you want to delete "{{ organizerToDelete?.organizer_name }}"?</p>
          <div class="flex justify-end gap-3">
            <button @click="showDeleteModal = false" class="px-4 py-2 text-gray-600 hover:text-gray-800">Cancel</button>
            <button @click="deleteOrganizer" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Delete</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useOrganizerStore } from '@/store/organizerStore';

export default defineComponent({
  name: 'ManageOrganizers',
  data() {
    return {
      showCreateForm: false,
      showDeleteModal: false,
      organizerToDelete: null as any,
      selectedPhoto: null as File | null,
      form: {
        organizer_name: '',
        organizer_website: '',
        organizer_bio: '',
        organizer_facebook_link: '',
        organizer_twitter_link: '',
        organizer_instagram_link: '',
      },
    };
  },
  computed: {
    organizerStore() {
      return useOrganizerStore();
    },
    loading(): boolean {
      return this.organizerStore.isLoading;
    },
    organizers(): any[] {
      return this.organizerStore.organizers;
    },
  },
  methods: {
    handlePhoto(e: Event) {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        this.selectedPhoto = target.files[0];
      }
    },
    async createOrganizer() {
      const formData = new FormData();
      formData.append('organizer_name', this.form.organizer_name);
      formData.append('organizer_website', this.form.organizer_website);
      formData.append('organizer_bio', this.form.organizer_bio);
      formData.append('organizer_facebook_link', this.form.organizer_facebook_link);
      formData.append('organizer_twitter_link', this.form.organizer_twitter_link);
      formData.append('organizer_instagram_link', this.form.organizer_instagram_link);
      formData.append('status', '1');

      if (this.selectedPhoto) {
        formData.append('organizer_photo', this.selectedPhoto);
      }

      try {
        await this.organizerStore.createOrganizer(formData);
        this.$notify({ type: 'success', title: 'Success', text: 'Organizer created successfully' });
        this.showCreateForm = false;
        this.resetForm();
      } catch (error) {
        this.$notify({ type: 'error', title: 'Error', text: 'Failed to create organizer' });
      }
    },
    confirmDelete(organizer: any) {
      this.organizerToDelete = organizer;
      this.showDeleteModal = true;
    },
    async deleteOrganizer() {
      if (this.organizerToDelete) {
        const success = await this.organizerStore.deleteOrganizer(this.organizerToDelete.id);
        if (success) {
          this.$notify({ type: 'success', title: 'Success', text: 'Organizer deleted successfully' });
        } else {
          this.$notify({ type: 'error', title: 'Error', text: 'Failed to delete organizer' });
        }
      }
      this.showDeleteModal = false;
      this.organizerToDelete = null;
    },
    resetForm() {
      this.form = {
        organizer_name: '',
        organizer_website: '',
        organizer_bio: '',
        organizer_facebook_link: '',
        organizer_twitter_link: '',
        organizer_instagram_link: '',
      };
      this.selectedPhoto = null;
    },
  },
  async mounted() {
    await this.organizerStore.fetchOrganizers();
  },
});
</script>
