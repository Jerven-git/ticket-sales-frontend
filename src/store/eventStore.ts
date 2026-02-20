import { defineStore } from 'pinia';
import { axiosInstance } from '@/axios/axios';

export interface EventTicket {
  id: number;
  event_id: number;
  ticket_name: string;
  ticket_price: number;
  ticket_quantity: number;
  ticket_per_user: number;
  ticket_description: string;
  sale_start_date: string | null;
  sale_start_time: string | null;
  sale_end_date: string | null;
  sale_end_time: string | null;
  event_publish_or_draft: boolean;
  remaining_ticket: number;
}

export interface EventMedia {
  id: number;
  path: string;
  format: string;
  mime_type: string;
}

export interface Event {
  id: number;
  user_id: number;
  event_title: string;
  event_type: boolean;
  event_location: string | null;
  event_link: string | null;
  event_note: string | null;
  event_description: string;
  event_refund: string;
  event_category: string;
  event_sub_category: string;
  event_code: string | null;
  organizer_id: number;
  organizer?: { id: number; organizer_name: string; organizer_website?: string; organizer_bio?: string };
  event_start_date: string;
  event_start_time: string;
  event_end_date: string;
  event_end_time: string;
  tickets: EventTicket[];
  media: EventMedia[];
  created_at: string;
  updated_at: string;
}

interface PaginationMeta {
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
  from: number;
  to: number;
}

export const useEventStore = defineStore('event', {
  state: () => ({
    events: [] as Event[],
    myEvents: [] as Event[],
    currentEvent: null as Event | null,
    searchResults: [] as Event[],
    loading: false,
    pagination: {
      currentPage: 1,
      lastPage: 1,
      perPage: 15,
      total: 0,
      from: 0,
      to: 0,
    } as PaginationMeta,
    searchPagination: {
      currentPage: 1,
      lastPage: 1,
      perPage: 15,
      total: 0,
      from: 0,
      to: 0,
    } as PaginationMeta,
  }),
  getters: {
    getEvents: (state) => state.events,
    getCurrentEvent: (state) => state.currentEvent,
    getSearchResults: (state) => state.searchResults,
    isLoading: (state) => state.loading,
    upcomingEvents: (state) => {
      const now = new Date().toISOString().split('T')[0];
      return state.events.filter(e => e.event_start_date >= now);
    },
    eventsByCategory: (state) => {
      return (category: string) => state.events.filter(e => e.event_category === category);
    },
  },
  actions: {
    async fetchEvents(filters: Record<string, string> = {}, page = 1) {
      this.loading = true;
      try {
        const params = new URLSearchParams({ ...filters, page: String(page) }).toString();
        const url = `/v1/events?${params}`;
        const response = await axiosInstance.get(url);
        const paginated = response.data.data;
        this.events = paginated.data;
        this.pagination = {
          currentPage: paginated.current_page,
          lastPage: paginated.last_page,
          perPage: paginated.per_page,
          total: paginated.total,
          from: paginated.from ?? 0,
          to: paginated.to ?? 0,
        };
      } catch (error) {
        console.error('Failed to fetch events:', error);
      } finally {
        this.loading = false;
      }
    },

    async fetchEvent(id: number) {
      this.loading = true;
      try {
        const response = await axiosInstance.get(`/v1/events/${id}`);
        this.currentEvent = response.data.data;
      } catch (error) {
        console.error('Failed to fetch event:', error);
      } finally {
        this.loading = false;
      }
    },

    async searchEvents(query: string, page = 1) {
      this.loading = true;
      try {
        const response = await axiosInstance.get(`/v1/events/search?q=${encodeURIComponent(query)}&page=${page}`);
        const paginated = response.data.data;
        this.searchResults = paginated.data;
        this.searchPagination = {
          currentPage: paginated.current_page,
          lastPage: paginated.last_page,
          perPage: paginated.per_page,
          total: paginated.total,
          from: paginated.from ?? 0,
          to: paginated.to ?? 0,
        };
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        this.loading = false;
      }
    },

    async fetchMyEvents() {
      this.loading = true;
      try {
        const response = await axiosInstance.get('/v1/my-events');
        this.myEvents = response.data.data.data;
      } catch (error) {
        console.error('Failed to fetch my events:', error);
      } finally {
        this.loading = false;
      }
    },

    async deleteEvent(id: number) {
      try {
        await axiosInstance.delete(`/v1/events/${id}`);
        this.events = this.events.filter(e => e.id !== id);
        this.myEvents = this.myEvents.filter(e => e.id !== id);
        return true;
      } catch (error) {
        console.error('Failed to delete event:', error);
        return false;
      }
    },
  },
});
