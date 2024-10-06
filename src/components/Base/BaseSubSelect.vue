<template>
    <div>
      <label :for="name" class="block mb-2 text-sm font-medium text-gray-900">{{ label }}</label>
      <select
        :name="name"
        :id="name"
        v-model="internalValue"
        :class="`bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block p-1.5 ${customClass}`"
        >
        <option v-for="option in options" :key="option.value" :value="option.value">
          {{ option.text }}
        </option>
      </select>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, watch } from 'vue';
  
  export default defineComponent({
    name: 'BaseSubSelect',
    props: {
      name: {
        type: String,
        required: true,
      },
      label: {
        type: String,
        required: true,
      },
      options: {
        type: Array as () => { text: string; value: string | number }[],
        required: true,
      },
      customClass: {
        type: String,
        default: '',
      },
      modelValue: {
        type: String,
        required: true,
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
      watch(
        () => props.modelValue,
        (newValue) => {
          internalValue.value = newValue;
        }
      );
  
      return { internalValue };
    },
  });
  </script>
  
  