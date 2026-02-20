import { defineStore } from 'pinia';
import { axiosInstance } from '@/axios/axios';

interface Organizer {
  id: number;
  organizer_name: string;
  organizer_website: string;
  organizer_bio: string;
  organizer_facebook_link: string;
  organizer_twitter_link: string;
  organizer_instagram_link: string;
  status: boolean;
  media: any[];
}

export const useOrganizerStore = defineStore('organizer', {
  state: () => ({
    organizers: [] as Organizer[],
    currentOrganizer: null as Organizer | null,
    loading: false,
  }),
  getters: {
    getOrganizers: (state) => state.organizers,
    getCurrentOrganizer: (state) => state.currentOrganizer,
    isLoading: (state) => state.loading,
  },
  actions: {
    async fetchOrganizers() {
      this.loading = true;
      try {
        const response = await axiosInstance.get('/v1/organizers');
        this.organizers = response.data.data;
      } catch (error) {
        console.error('Failed to fetch organizers:', error);
      } finally {
        this.loading = false;
      }
    },

    async fetchOrganizer(id: number) {
      this.loading = true;
      try {
        const response = await axiosInstance.get(`/v1/organizers/${id}`);
        this.currentOrganizer = response.data.data;
      } catch (error) {
        console.error('Failed to fetch organizer:', error);
      } finally {
        this.loading = false;
      }
    },

    async createOrganizer(formData: FormData) {
      try {
        const response = await axiosInstance.post('/v1/organizers', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        await this.fetchOrganizers();
        return response.data;
      } catch (error) {
        console.error('Failed to create organizer:', error);
        throw error;
      }
    },

    async updateOrganizer(id: number, formData: FormData) {
      try {
        formData.append('_method', 'PUT');
        const response = await axiosInstance.post(`/v1/organizers/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        await this.fetchOrganizers();
        return response.data;
      } catch (error) {
        console.error('Failed to update organizer:', error);
        throw error;
      }
    },

    async deleteOrganizer(id: number) {
      try {
        await axiosInstance.delete(`/v1/organizers/${id}`);
        this.organizers = this.organizers.filter(o => o.id !== id);
        return true;
      } catch (error) {
        console.error('Failed to delete organizer:', error);
        return false;
      }
    },
  },
});
