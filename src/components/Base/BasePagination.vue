<template>
  <nav v-if="lastPage > 1" class="flex items-center justify-between border-t border-gray-200 px-4 py-3 mt-6">
    <div class="flex items-center gap-2">
      <span class="text-sm text-gray-700">
        Showing {{ from }} to {{ to }} of {{ total }} results
      </span>
    </div>
    <div class="flex gap-1">
      <button
        v-if="currentPage > 1"
        @click="$emit('page-change', currentPage - 1)"
        class="px-3 py-1 text-sm rounded bg-white text-gray-600 hover:bg-gray-100 border"
      >
        Prev
      </button>
      <button
        v-for="page in visiblePages"
        :key="page"
        @click="$emit('page-change', page)"
        class="px-3 py-1 text-sm rounded"
        :class="page === currentPage
          ? 'bg-primary-600 text-white'
          : 'bg-white text-gray-600 hover:bg-gray-100 border'"
      >
        {{ page }}
      </button>
      <button
        v-if="currentPage < lastPage"
        @click="$emit('page-change', currentPage + 1)"
        class="px-3 py-1 text-sm rounded bg-white text-gray-600 hover:bg-gray-100 border"
      >
        Next
      </button>
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'BasePagination',
  props: {
    currentPage: { type: Number, required: true },
    lastPage: { type: Number, required: true },
    total: { type: Number, required: true },
    from: { type: Number, default: 0 },
    to: { type: Number, default: 0 },
  },
  emits: ['page-change'],
  computed: {
    visiblePages(): number[] {
      const pages: number[] = [];
      const start = Math.max(1, this.currentPage - 2);
      const end = Math.min(this.lastPage, this.currentPage + 2);
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      return pages;
    },
  },
});
</script>
