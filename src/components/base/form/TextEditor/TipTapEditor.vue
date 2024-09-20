<script setup>
import TipTapEditorContainer from '@/components/base/form/TextEditor/TipTapEditorContainer.vue'
import TipTapEditorContent from '@/components/base/form/TextEditor/TipTapEditorContent.vue'
import TipTapModals from '@/components/base/form/TextEditor/TipTapModals.vue'
import { onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import {
    emitsDefinitions,
    propsDefinitions,
    useTipTap,
} from '@/components/base/form/TextEditor/useTipTap.js'

const { t } = useI18n()

// events
const emit = defineEmits(emitsDefinitions)

// props
const props = defineProps(propsDefinitions)

const { editor, resetContent, appendTranslationsStyle, initEditor, destroyEditor } = useTipTap({
    props,
    emit,
    t,
})

// lifecycle
onMounted(() => {
    appendTranslationsStyle()
    initEditor()
})

onBeforeUnmount(() => {
    destroyEditor()
})

// expose
// editor needs to be accessed by parent (see HelpAdminTab.vue)
defineExpose({
    editor,
    resetContent,
})
</script>
<template>
    <TipTapEditorContainer v-if="editor" :editor="editor" :mode="mode">
        <TipTapModals
            :editor="editor"
            :mode="mode"
            :show-menu="mode !== 'none'"
            :save-icon-visible="saveIconVisible"
            :save-image-callback="saveImageCallback"
            @image="emit('image', $event)"
            @saved="emit('saved', $event)"
        />

        <TipTapEditorContent :editor="editor" />
    </TipTapEditorContainer>
</template>
