<template>
    <button
      :type="type"
      :class="[
        'w-32 text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center',
        customClass
      ]"
      :disabled="disabled"
      @click="handleClick"
    >
      <slot>{{ label }}</slot>
    </button>
  </template>

  <script lang="ts">
  import { defineComponent, PropType } from 'vue';

  export default defineComponent({
    name: 'BaseButton',
    props: {
      label: {
        type: String,
        default: 'Button',
      },
      type: {
        type: String as PropType<'button' | 'submit' | 'reset'>,
        default: 'button',
      },
      customClass: {
        type: String,
        default: '',
      },
      disabled: {
        type: Boolean,
        default: false,
      },
    },
    emits: ['click'],
    methods: {
      handleClick(event: Event) {
        this.$emit('click', event);
      },
    },
  });
  </script>
