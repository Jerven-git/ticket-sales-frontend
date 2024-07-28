<template>
    <div class="relative"></div>
        <img 
         src="https://imgur.com/O9Wmyek"
         alt="Profile Picture"
         class="w-12 h-12 rounded-full cursor-pointer"
         @click="toggleMenu"
        />
        <div
         v-if="showMenu"
         class="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg"
         >
            <router-link
             :to="{ name: 'home' }"
             class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
             >
             View profile
            </router-link>
            <router-link
             :to="{ name: 'home' }"
             class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
             >
             Manage organizer
            </router-link>
            <router-link
             :to="{ name: 'home' }"
             class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
             >
             Manage event
            </router-link>
            <router-link
             :to="{ name: 'home' }"
             class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
             >
             My save events
            </router-link>
            <router-link
             :to="{ name: 'home' }"
             class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
             >
             Following organizer
            </router-link>
            <div
             class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
             @click="logout"
             >
             Sign out
            </div>
        </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useAuthStore } from '../store/authLogin';

export default defineComponent({
  name: 'ProfileMenu',
  data() {
    return{
        showMenu: false,
    }
  },
  methods: {
    toggleMenu() {
      this.showMenu =!this.showMenu;
    },
    logout() {
      const authStore = useAuthStore();
      authStore.logout();
      this.$router.push({ name: 'login' });
    },
  }
});
</script>