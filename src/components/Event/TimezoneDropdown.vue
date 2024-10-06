<template>
  <div>
    <label for="timezone" class="block mb-2">Select Timezone</label>
    <input
      type="text"
      v-model="searchQuery"
      placeholder="Search for a timezone"
      class="w-full p-2 border border-gray-300 rounded-md mb-2"
    />
    <select id="timezone" v-model="selectedTimezone" class="w-full p-2 border border-gray-300 rounded-md">
      <option
        v-for="timezone in filteredTimezones"
        :key="timezone.value"
        :value="timezone.value"
      >
        {{ timezone.label }}
      </option>
      <option v-if="filteredTimezones.length === 0" disabled>No timezones available</option>
    </select>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import moment from 'moment-timezone';

// Mapping of timezone names to city names
const timezoneCityMap: Record<string, string> = {
  "Africa/Cairo": "Cairo",
  "Africa/Nairobi": "Nairobi",
  "America/New_York": "New York",
  "America/Los_Angeles": "Los Angeles",
  "Asia/Singapore": "Singapore",
  "Asia/Tokyo": "Tokyo",
  "Europe/London": "London",
  "Australia/Sydney": "Sydney",
};

export default defineComponent({
  name: 'TimezoneDropdown',
  data() {
    return {
      selectedTimezone: '', // Stores the selected timezone
      timezones: [] as { value: string; label: string }[], // Array to store formatted GMT timezones
      searchQuery: '', // Stores the search query
    };
  },
  computed: {
    filteredTimezones() {
      return this.timezones.filter(timezone =>
        timezone.label.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
  },
  mounted() {
    const citySet = new Set(); // Set to track added city names

    // Fetch the timezone names and format them
    this.timezones = moment.tz.names().reduce((acc, timezone: string) => {
      const offset = moment.tz(timezone).utcOffset(); // Get the UTC offset in minutes
      const formattedOffset = `(GMT${offset >= 0 ? '+' : ''}${(offset / 60).toFixed(2)})`; // Format the offset
      const cityName = timezoneCityMap[timezone] || timezone; // Get the city name or fallback to timezone string
      
      // Only add the timezone if the city name hasn't been added yet
      if (!citySet.has(cityName)) {
        citySet.add(cityName);
        acc.push({
          value: timezone,
          label: `${formattedOffset} ${cityName}`, // Use city name
        });
      }
      return acc;
    }, [] as { value: string; label: string }[]);
  },
});
</script>
