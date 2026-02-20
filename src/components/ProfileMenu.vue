<template>
    <div class="relative">
        <img
         src="https://imgur.com/O9Wmyek.png"
         alt="Profile Picture"
         class="w-12 h-12 rounded-full cursor-pointer"
         @click="toggleMenu"
        />
        <div
         v-if="showMenu"
         class="absolute flex flex-col z-30 right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg"
         >
            <router-link
             :to="{ name: 'profile' }"
             class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
             @click="showMenu = false"
             >
             View profile
            </router-link>
            <router-link
             :to="{ name: 'manage-organizers' }"
             class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
             @click="showMenu = false"
             >
             Manage organizers
            </router-link>
            <router-link
             :to="{ name: 'manage-events' }"
             class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
             @click="showMenu = false"
             >
             Manage events
            </router-link>
            <router-link
             :to="{ name: 'events' }"
             class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
             @click="showMenu = false"
             >
             Browse events
            </router-link>
            <div
             class="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-600"
             @click="logout"
             >
             Sign out
            </div>
        </div>
      </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useAuthStore } from '@/store/authLogin';

export default defineComponent({
  name: 'ProfileMenu',
  data() {
    return {
        showMenu: false,
    }
  },
  methods: {
    toggleMenu() {
      this.showMenu = !this.showMenu;
    },
    closeDropdown(event: Event) {
      const target = event.target as HTMLElement;
      if (this.$el && !this.$el.contains(target)) {
        this.showMenu = false;
      }
    },
    logout() {
      const authStore = useAuthStore();
      authStore.logout();
      this.showMenu = false;
    },
  },
  mounted() {
    document.addEventListener('click', this.closeDropdown);
  },
  beforeUnmount() {
    document.removeEventListener('click', this.closeDropdown);
  }
});
</script>
