<template>
    <div>
      <label :for="name" class="block mb-2 text-sm font-medium text-gray-900">{{ label }}</label>
      <input
        :type="type"
        :name="name"
        :id="name"
        :class="`bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block p-1.5 ${customClass}`"
        :placeholder="placeholder"
        v-model="internalValue"
        required
      />
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, watch } from 'vue';
  
  export default defineComponent({
    name: 'BaseInput',
    props: {
      modelValue: {
        type: String,
        default: ''
    },
      type: {
        type: String,
        default: 'text'
    },
      name: {
        type: String,
        required: true
    },
      label: {
        type: String,
        required: true
    },
      placeholder: {
        type: String, default: ''
    },
      customClass: {
        type: String,
        default: ''
    },
    },
    emits: ['update:modelValue'],
    setup(props, { emit }) {
      // Create a local ref for internal value, initialized with modelValue
      const internalValue = ref(props.modelValue);
  
      // Watch for changes to internalValue and emit the change
      watch(internalValue, (newValue) => {
        emit('update:modelValue', newValue);
      });
  
      // Watch for changes to modelValue and update internalValue accordingly
      watch(() => props.modelValue,
      (newValue) => {
        internalValue.value = newValue;
      });
  
      return { internalValue };
    },
  });
  </script>  