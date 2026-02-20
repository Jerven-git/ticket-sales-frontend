<template>
    <div :class="customClass">
        <label :for="name" class="block mb-2 text-sm font-medium text-gray-900">{{ label }}</label>
        <quill-editor
            :content="internalValue"
            content-type="html"
            :options="editorOptions"
            @update:content="onContentChange"
            :placeholder="placeholder"
            class="quill-editor"
            :style="{ height: editorHeight }"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, PropType } from 'vue';
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';

export default defineComponent({
    name: 'BaseQuillTextEditor',
    components: {
        QuillEditor,
    },
    props: {
        modelValue: {
            type: String as PropType<string>,
            required: true,
        },
        editorOptions: {
            type: Object as PropType<Record<string, any>>,
            default: () => ({
                theme: 'snow',
            }),
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
            default: 'Type something...',
        },
        customClass: {
            type: String,
            default: '',
        },
        editorHeight: {
            type: String,
            default: '200px',
        },
    },
    setup(props, { emit }) {
        const internalValue = ref(props.modelValue);

        watch(
            () => props.modelValue,
            (newValue) => {
                if (newValue !== internalValue.value) {
                    internalValue.value = newValue;
                }
            }
        );

        const onContentChange = (content: string) => {
            internalValue.value = content;
            emit('update:modelValue', content);
        };

        return {
            internalValue,
            onContentChange,
        };
    },
});
</script>
