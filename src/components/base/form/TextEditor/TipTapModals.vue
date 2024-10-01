<script setup>
import EditorModalImage from './modals/EditorModalImage.vue'
import EditorModalLink from './modals/EditorModalLink.vue'
import EditorModalColor from './modals/EditorModalColor.vue'
import EditorModalVideo from './modals/EditorModalVideo.vue'
import TableMenuBar from './TableMenuBar.vue'
import LinkMenuBar from './LinkMenuBar.vue'
import ImageMenuBar from './ImageMenuBar.vue'
import VideoMenuBar from './VideoMenuBar.vue'
import MenuBar from './MenuBar.vue'
import { reactive } from 'vue'

const emit = defineEmits(['image', 'saved'])

defineProps({
    editor: { type: Object, required: true },
    showMenu: { type: Boolean, required: true },
    mode: { type: String, required: true },

    saveIconVisible: { type: Boolean, default: false },
    saveImageCallback: {
        // function must take a file argument and return a promise resolving to an {url, width, height} object
        type: [Function, null],
        required: false,
        default: null,
    },
})

// data

const activeModals = reactive({
    image: false,
    link: false,
    video: false,
    color: false,
})

// methods

function openLinkModal() {
    activeModals.link = true
}

function openColorModal() {
    activeModals.color = true
}

function openVideoModal() {
    activeModals.video = true
}

function openImageModal() {
    activeModals.image = true
}
</script>
<template>
    <EditorModalImage
        v-if="activeModals.image"
        :editor="editor"
        :save-image-callback="saveImageCallback"
        @close-modal="activeModals.image = false"
        @image="emit('image', $event)"
    />

    <EditorModalLink
        v-if="activeModals.link"
        :editor="editor"
        @close-modal="activeModals.link = false"
    />

    <EditorModalColor
        v-if="activeModals.color"
        :editor="editor"
        @close-modal="activeModals.color = false"
    />

    <EditorModalVideo
        v-if="activeModals.video"
        :editor="editor"
        @close-modal="activeModals.video = false"
    />

    <MenuBar
        v-if="showMenu"
        class="editor-header"
        :editor="editor"
        :mode="mode"
        :open-color-modal="openColorModal"
        :open-image-modal="openImageModal"
        :open-link-modal="openLinkModal"
        :open-video-modal="openVideoModal"
        :save-icon-visible="saveIconVisible"
        @saved="$emit('saved')"
    />

    <TableMenuBar v-if="showMenu && mode === 'full'" :editor="editor" class="editortablemenu" />

    <LinkMenuBar
        v-if="showMenu && mode !== 'none'"
        :editor="editor"
        :open-link-modal="openLinkModal"
        class="editorlinkmenu"
    />

    <ImageMenuBar :editor="editor" v-if="showMenu && mode !== 'none'" />

    <VideoMenuBar :editor="editor" v-if="showMenu && mode !== 'none'" />
</template>
<style lang="scss" scoped>
.editor-header {
    background: $white;
    color: $primary-dark;
    display: flex;
    padding: 5px 20px;
    position: sticky;
    z-index: 10;
    width: 100%;
    justify-content: space-between;
    border-bottom: $border-width-s solid $primary;
    top: 0;
    box-sizing: border-box;

    .icons {
        align-items: center;
        display: flex;

        .menu-item {
            color: $primary-dark;
        }
    }
}
</style>
