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
      >
      </textarea>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';

export default defineComponent({
name: 'BaseTextArea',
props: {
    modelValue: {
    type: String,
    default: ''
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
    type: String,
    default: ''
    },
    customClass: {
    type: String,
    default: ''
    },
},
emits: ['update:modelValue'],
setup(props, { emit }) {
    // Local state to handle textarea value
    const internalValue = ref(props.modelValue);

    // Sync local value with parent when it changes
    watch(() => props.modelValue, (newValue) => {
    internalValue.value = newValue;
    });

    // Emit changes to parent when internal value changes
    watch(internalValue, (newValue) => {
    emit('update:modelValue', newValue);
    });

    return { internalValue };
},
});
</script>  