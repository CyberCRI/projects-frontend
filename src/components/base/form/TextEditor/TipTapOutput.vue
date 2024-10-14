<script setup>
import { ref, watch, nextTick, useAttrs } from 'vue'
import fixEditorContent from '@/functs/editorUtils.ts'

const props = defineProps({
    content: { type: String, default: '' },
})

const attrs = useAttrs()

const wrapper = ref(null)

watch(
    () => [props.content, wrapper.value],
    () => {
        nextTick(
            () => {
                if (wrapper.value) fixEditorContent(wrapper.value)
            },
            {
                immediate: true,
            }
        )
    }
)
</script>
<template>
    <div ref="wrapper" v-bind="attrs" v-html="content"></div>
</template>
