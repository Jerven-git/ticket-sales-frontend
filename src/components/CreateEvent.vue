<template>
    <div class="flex flex-col items-center my-10 justify-center w-full md:w-1/2 px-6 py-8 mx-auto lg:py-0">
        <h1 class="text-2xl font-bold text-dark-gray mb-6">Create Event</h1>
        <form @submit.prevent="handleSubmit" class="space-y-4 md:space-y-6 p-6 w-full max-w-[650px]">
            <!-- Event Details -->
            <div class="relative w-full mb-5 group">
                <BaseInput
                    type="text"
                    name="title"
                    label="Event Title"
                    placeholder="Name of event"
                    v-model="eventTitle"
                    customClass="w-full"
                />
            </div>
            <div class="relative w-full mb-5 group">
                <label class="block mb-1 text-sm font-medium text-gray-700">Organizer</label>
                <select
                    v-model="organizerId"
                    class="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2.5"
                >
                    <option value="">Select an organizer</option>
                    <option v-for="org in organizers" :key="org.id" :value="org.id">
                        {{ org.organizer_name }}
                    </option>
                </select>
            </div>
            <div class="grid md:grid-cols-2 md:gap-3">
                <div class="relative w-full mb-5 group">
                    <BaseSelect
                        name="category"
                        label="Category"
                        :options="mainCategoryOptions()"
                        v-model="selectedCategory"
                        customClass="w-full"
                    />
                </div>
                <div class="relative z-0 w-full mb-5 group">
                    <BaseSubSelect
                        name="sub-category"
                        label="Sub-Category"
                        :options="subCategoryOptions()"
                        v-model="selectedSubCategory"
                        customClass="w-full"
                    />
                </div>
            </div>
            <div class="relative w-full mb-5 group">
              <EventType ref="eventType" />
            </div>
            <div class="relative w-full mb-5 group">
              <TimezoneDropdown
                class="w-full"
                v-model="selectedTimeZone"
              />
            </div>
            <div class="relative w-full mb-5 group">
              <EventCalendar
                class="w-full"
                v-model="selectedDateTime"
              />
            </div>

            <!-- Event Image -->
            <div class="relative w-full mb-5 group">
              <label class="block text-sm font-medium text-gray-700 mb-2">Event Image</label>
              <input
                type="file"
                @change="handleImageUpload"
                accept="image/jpeg,image/png,image/jpg,image/gif"
                class="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
              />
              <div v-if="imagePreview" class="mt-2">
                <img :src="imagePreview" alt="Preview" class="h-32 rounded-lg object-cover" />
              </div>
            </div>

            <!-- Description -->
            <div class="flex flex-col items-center">
              <BaseQuillTextEditor
                v-model="quillText"
                name="editor"
                label="Event Description"
                placeholder="Describe your event..."
                customClass="my-editor-class w-full mb-4"
                editorHeight="300px"
              />
            </div>

            <!-- Refund Policy -->
            <div class="relative w-full mb-5 group">
                <BaseInput
                    type="text"
                    name="refund"
                    label="Refund Policy"
                    placeholder="e.g., No refunds, 48-hour refund window"
                    v-model="refundPolicy"
                    customClass="w-full"
                />
            </div>

            <!-- Ticket Section -->
            <div class="border-t pt-6 mt-6">
              <h2 class="text-xl font-semibold text-dark-gray mb-4">Ticket Information</h2>
              <div class="grid md:grid-cols-2 md:gap-3">
                <div class="relative w-full mb-5 group">
                  <BaseInput
                    type="text"
                    name="ticket_name"
                    label="Ticket Name"
                    placeholder="e.g., General Admission"
                    v-model="ticketName"
                    customClass="w-full"
                  />
                </div>
                <div class="relative w-full mb-5 group">
                  <BaseInput
                    type="number"
                    name="ticket_price"
                    label="Ticket Price"
                    placeholder="0"
                    v-model="ticketPrice"
                    customClass="w-full"
                  />
                </div>
              </div>
              <div class="grid md:grid-cols-2 md:gap-3">
                <div class="relative w-full mb-5 group">
                  <BaseInput
                    type="number"
                    name="ticket_quantity"
                    label="Ticket Quantity"
                    placeholder="100"
                    v-model="ticketQuantity"
                    customClass="w-full"
                  />
                </div>
                <div class="relative w-full mb-5 group">
                  <BaseInput
                    type="number"
                    name="ticket_per_user"
                    label="Max Tickets Per User"
                    placeholder="5"
                    v-model="ticketPerUser"
                    customClass="w-full"
                  />
                </div>
              </div>
              <div class="relative w-full mb-5 group">
                <BaseInput
                  type="text"
                  name="ticket_description"
                  label="Ticket Description"
                  placeholder="Brief description of what the ticket includes"
                  v-model="ticketDescription"
                  customClass="w-full"
                />
              </div>

              <!-- Publish Toggle -->
              <div class="flex items-center gap-3 mb-5">
                <label class="text-sm font-medium text-gray-700">Publish Event:</label>
                <button
                  type="button"
                  @click="publishOrDraft = !publishOrDraft"
                  class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
                  :class="publishOrDraft ? 'bg-primary-600' : 'bg-gray-300'"
                >
                  <span
                    class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                    :class="publishOrDraft ? 'translate-x-6' : 'translate-x-1'"
                  ></span>
                </button>
                <span class="text-sm text-gray-500">{{ publishOrDraft ? 'Published' : 'Draft' }}</span>
              </div>
            </div>

            <!-- Submit -->
            <div class="flex justify-center pt-4">
              <BaseButton
                  label="Create Event"
                  type="submit"
                  customClass="w-40"
                  :disabled="submitting"
              />
            </div>
        </form>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import BaseButton from '@/components/Base/BaseButton.vue';
import BaseInput from '@/components/Base/BaseInput.vue';
import BaseSelect from '@/components/Base/BaseSelect.vue';
import BaseSubSelect from '@/components/Base/BaseSubSelect.vue';
import EventType from '@/components/Event/EventType.vue';
import TimezoneDropdown from '@/components/Event/TimezoneDropdown.vue';
import EventCalendar from '@/components/Event/EventCalendar.vue';
import BaseQuillTextEditor from '@/components/Base/BaseQuillTextEditor.vue';
import { axiosInstance } from '@/axios/axios';
import { useOrganizerStore } from '@/store/organizerStore';

export default defineComponent({
  name: 'CreateEvent',
  components: {
    BaseButton,
    BaseInput,
    BaseSelect,
    BaseSubSelect,
    EventType,
    TimezoneDropdown,
    EventCalendar,
    BaseQuillTextEditor
   },
  data() {
    return {
        eventTitle: '',
        organizerId: '' as string | number,
        selectedCategory: '',
        selectedSubCategory: '',
        selectedTimeZone: '',
        selectedDateTime: { startDate: '', endDate: '', startTime: '', endTime: '' },
        quillText: '',
        eventImage: null as File | null,
        imagePreview: '',
        refundPolicy: '',
        ticketName: '',
        ticketPrice: '',
        ticketQuantity: '',
        ticketPerUser: '',
        ticketDescription: '',
        publishOrDraft: false,
        submitting: false,
    }
  },
  computed: {
    organizers(): any[] {
      return useOrganizerStore().getOrganizers;
    },
  },
  async mounted() {
    await useOrganizerStore().fetchOrganizers();
  },
  methods: {
    mainCategoryOptions() {
      return [
        { text: 'Select a Category', value: '' },
        { text: 'Music', value: 'Music' },
        { text: 'Sports', value: 'Sports' },
        { text: 'Tournament', value: 'Tournament' }
      ];
    },

    subCategoryOptions() {
      if (this.selectedCategory === 'Music') {
        return [
          { text: 'Select a Sub-Category', value: '' },
          { text: 'Rock', value: 'rock' },
          { text: 'Pop', value: 'pop' },
          { text: 'Jazz', value: 'jazz' },
        ];
      } else if (this.selectedCategory === 'Sports') {
        return [
          { text: 'Select a Sub-Category', value: '' },
          { text: 'Football', value: 'football' },
          { text: 'Basketball', value: 'basketball' },
        ];
      } else if (this.selectedCategory === 'Tournament') {
        return [
          { text: 'Select a Sub-Category', value: '' },
          { text: 'Local', value: 'local' },
          { text: 'National', value: 'national' },
        ];
      }
      return [{ text: 'Select a Sub-Category', value: '' }];
    },

    handleImageUpload(e: Event) {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        this.eventImage = target.files[0];
        this.imagePreview = URL.createObjectURL(target.files[0]);
      }
    },

    async handleSubmit() {
      if (this.submitting) return;
      this.submitting = true;

      try {
        const eventTypeRef = this.$refs.eventType as any;
        const isOnline = eventTypeRef?.isOnlineEvent || false;
        const location = eventTypeRef?.location || '';
        const eventLink = eventTypeRef?.eventLink || '';
        const eventNote = eventTypeRef?.eventNote || '';

        const formData = new FormData();
        formData.append('event_title', this.eventTitle);
        formData.append('event_type', isOnline ? '1' : '0');
        formData.append('event_location', location);
        formData.append('event_link', eventLink);
        formData.append('event_note', eventNote);
        formData.append('event_description', this.quillText);
        formData.append('event_refund', this.refundPolicy);
        formData.append('event_category', this.selectedCategory);
        formData.append('event_sub_category', this.selectedSubCategory);
        formData.append('event_code', '');
        formData.append('organizer_id', String(this.organizerId));
        formData.append('event_start_date', this.selectedDateTime.startDate);
        formData.append('event_start_time', this.selectedDateTime.startTime);
        formData.append('event_end_date', this.selectedDateTime.endDate);
        formData.append('event_end_time', this.selectedDateTime.endTime);
        formData.append('ticket_name', this.ticketName);
        formData.append('ticket_price', this.ticketPrice);
        formData.append('ticket_quantity', this.ticketQuantity);
        formData.append('ticket_per_user', this.ticketPerUser);
        formData.append('ticket_description', this.ticketDescription);
        formData.append('event_publish_or_draft', this.publishOrDraft ? '1' : '0');

        if (this.eventImage) {
          formData.append('event_image', this.eventImage);
        }

        await axiosInstance.get('/sanctum/csrf-cookie');
        await axiosInstance.post('/v1/events', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        this.$notify({
          type: 'success',
          title: 'Success',
          text: 'Event created successfully!'
        });

        this.$router.push({ name: 'events' });
      } catch (error: any) {
        let errorMessage = 'Failed to create event. Please check all fields.';
        if (error.response && error.response.data && error.response.data.error) {
          const errors = error.response.data.error;
          if (typeof errors === 'object') {
            errorMessage = Object.values(errors).flat().join(', ');
          } else {
            errorMessage = errors;
          }
        }
        this.$notify({
          type: 'error',
          title: 'Error',
          text: errorMessage,
        });
      } finally {
        this.submitting = false;
      }
    },
  },
  watch: {
    selectedCategory(newVal: string, oldVal: string) {
      if (newVal !== oldVal) {
        this.selectedSubCategory = '';
      }
    }
  },
});
</script>
