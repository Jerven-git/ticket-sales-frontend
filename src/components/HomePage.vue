<template>
  <div class="bg-black min-h-screen flex flex-col">
    <!-- <NavBar /> -->
    <div class="flex-grow flex items-center justify-center">
      <div class="text-white">Welcome to the Home Page</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
// import NavBar from './NavBar.vue';

export default defineComponent({
  name: 'HomePage',
  components: {
    // NavBar,
  },
});
</script>
