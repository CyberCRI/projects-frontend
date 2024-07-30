<script setup>
import TipTapEditorContainer from '@/components/base/form/TextEditor/TipTapEditorContainer.vue'
import TipTapEditorContent from '@/components/base/form/TextEditor/TipTapEditorContent.vue'
import TipTapModals from '@/components/base/form/TextEditor/TipTapModals.vue'
import { watch, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import {
    emitsDefinitions,
    propsDefinitions,
    useTipTap,
} from '@/components/base/form/TextEditor/useTipTap.js'

const store = useStore()
const { t } = useI18n()

// events
const emit = defineEmits(emitsDefinitions)

// props
const props = defineProps(propsDefinitions)

const { editor, editorInited, appendTranslationsStyle, initEditor, destroyEditor } = useTipTap({
    props,
    emit,
    store,
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

// watcher

watch(
    () => props.wsData,
    () => {
        editorInited.value = false
        // Reinit editor so that changes in wsData props are visible in editor
        initEditor()
    }
)

// expose
// editor needs to be accessed by parent (see HelpAdminTab.vue)
defineExpose({
    editor,
})
</script>
<template>
    <TipTapEditorContainer v-if="editor" :mode="mode">
        <TipTapModals
            :editor="editor"
            :mode="mode"
            :show-menu="mode !== 'none'"
            :save-icon-visible="saveIconVisible"
            :save-image-callback="saveImageCallback"
            @image="emit('image', $event)"
            @update="emit('update', $event)"
            @destroy="emit('destroy', $event)"
            @saved="emit('saved', $event)"
        />

        <TipTapEditorContent :editor="editor" />
    </TipTapEditorContainer>
</template>
