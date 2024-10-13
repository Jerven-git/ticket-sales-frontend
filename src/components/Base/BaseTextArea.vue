<template>
  <div>
    <label :for="name" class="block mb-2 text-sm font-medium text-gray-900">{{ label }}</label>
    <textarea
      :name="name"
      :id="name"
      :class="`bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block p-1.5 ${customClass}`"
      :placeholder="placeholder"
      v-model="internalValue"
      required
    ></textarea>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'BaseTextArea',
  props: {
    modelValue: {
      type: String,
      default: '',
    },
    name: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    placeholder: {
      type: String,
      default: '',
    },
    customClass: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      internalValue: this.modelValue, // Initialize internal value with modelValue
    };
  },
  watch: {
    // Watch for changes in modelValue and update internalValue accordingly
    modelValue(newValue) {
      this.internalValue = newValue;
    },
    // Watch for changes in internalValue to emit updates
    internalValue(newValue) {
      this.$emit('update:modelValue', newValue);
    },
  },
});
</script>
