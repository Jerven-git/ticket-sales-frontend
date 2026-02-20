<template>
    <div class="max-w-lg mx-auto my-10 bg-white text-center">
        <img class="w-32 h-32 rounded-full mx-auto" src="https://imgur.com/O9Wmyek.png" alt="Profile picture">
        <h2 class="text-center text-2xl font-semibold mt-3">{{ userName }}</h2>
        <p class="text-center text-gray-600 mt-1">{{ userEmail }}</p>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useAuthStore } from '@/store/authLogin';

export default defineComponent({
  name: 'ProfilePicture',
  computed: {
    userName(): string {
      const authStore = useAuthStore();
      const user = authStore.getUser as any;
      if (user) {
        return `${user.first_name} ${user.last_name}`;
      }
      return 'User';
    },
    userEmail(): string {
      const authStore = useAuthStore();
      const user = authStore.getUser as any;
      return user?.email || '';
    },
  },
});
</script>
