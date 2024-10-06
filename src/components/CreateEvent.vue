<template>
    <div class="flex flex-col items-center my-10 justify-center w-full md:w-1/2 px-6 py-8 mx-auto lg:py-0">
        <form class="space-y-4 md:space-y-6" action="#">
            <div class="relative z-0 w-full mb-5 group">
                <BaseInput
                    type="text"
                    name="title"
                    label="Event Title"
                    placeholder="Name of event"
                    customClass="w-[420px]"
                />
            </div>
            <div class="relative z-0 w-full mb-5 group">
                <BaseInput
                    type="text"
                    name="organizer"
                    label="Organizer name"
                    placeholder="Name of organizer"
                    customClass="w-[420px]"
                />
            </div>
            <div class="grid md:grid-cols-2 md:gap-3">
                <div class="relative z-0 w-full mb-5 group">
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
            <div class="relative z-0 w-full mb-5 group">
                <EventType />
            </div>
            <div class="relative z-0 w-full mb-5 group">
                <TimezoneDropdown class="w-[420px]" />
            </div>
            <div class="flex justify-center">
                <BaseButton
                    label="Submit"
                    type="submit"
                    customClass="w-24"
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

export default defineComponent({
  name: 'CreateEvent',
  components: {
    BaseButton,
    BaseInput,
    BaseSelect,
    BaseSubSelect,
    EventType,
    TimezoneDropdown
   },
  data() {
    return{
        selectedCategory: '',
        selectedSubCategory: '',
    }
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
    }
  },
  watch: {
    selectedCategory(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.selectedSubCategory = '';
      }
    }
  },
});
</script>