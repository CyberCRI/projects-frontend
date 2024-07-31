<script setup>
import funct from '@/functs/functions.ts'
import ConfirmModal from '@/components/base/modal/ConfirmModal.vue'
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
import { useI18n } from 'vue-i18n'

const t = useI18n()

const emit = defineEmits(['update', 'destroy', 'image', 'saved'])

const props = defineProps({
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
    destroy: false,
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

function openDestroyModal() {
    activeModals.destroy = true
}

function handleLinkModalConfirmed(data) {
    // set the link if there's data from popup
    if (data) {
        props.editor
            .chain()
            .focus()
            .extendMarkRange('link')
            .setLink({
                href: (funct.isValidUrl(data.href) ? '' : 'http://') + data.href,
            })
            .run()
        // if link made from empty selection, add the entered text as content
        if (data.text) {
            const selection = props.editor.view.state.selection
            props.editor
                .chain()
                .focus()
                .insertContentAt(
                    {
                        from: selection.from,
                        to: selection.to,
                    },
                    data.text
                )
                .run()
        }
    } else {
        // if there is no data, unset the link
        props.editor.chain().focus().extendMarkRange('link').unsetLink().run()
    }

    activeModals.link = false
}

function handleColorModalConfirmed(data) {
    if (data) {
        props.editor.chain().focus().setColor(data).run()
    } else {
        props.editor.chain().focus().unsetColor().run()
    }

    activeModals.link = false
}

function handleVideoModalConfirmed(data) {
    props.editor.chain().focus().setExternalVideo({ src: data.src }).run()

    activeModals.video = false
}

function handleDestroyModalConfirmed() {
    // reset modification
    emit('update', props.wsData.originalContent)
    props.editor.commands.setContent(props.wsData.originalContent)

    activeModals.destroy = false
    emit('destroy')
}

function handleImageModalConfirmed(img) {
    const MAX_SIZE = 1100
    const attrsw = img.width < MAX_SIZE ? img.width : MAX_SIZE
    const attrsh =
        img.height < MAX_SIZE ? img.height : img.height * (MAX_SIZE / parseFloat(img.width))

    props.editor
        .chain()
        .focus()
        .setImage({
            src: img.static_url,
            width: attrsw,
            height: attrsh,
        })
        .run()

    activeModals.image = false
}

function handleImage(img) {
    emit('image', img)
}
</script>
<template>
    <ConfirmModal
        v-if="activeModals.destroy"
        :content="`${t('description.delete')} ${t('description.edit-saved')}`"
        :title="t('description.quit-without-saving-title')"
        @cancel="activeModals.destroy = false"
        @confirm="handleDestroyModalConfirmed"
    />
    <EditorModalImage
        v-if="activeModals.image"
        @close-modal="activeModals.image = false"
        @image="handleImage"
        @on-confirm="handleImageModalConfirmed"
        :save-image-callback="saveImageCallback"
    />

    <EditorModalLink
        v-if="activeModals.link"
        :editor="editor"
        @close-modal="activeModals.link = false"
        @on-confirm="handleLinkModalConfirmed"
    />

    <EditorModalColor
        v-if="activeModals.color"
        :editor="editor"
        @close-modal="activeModals.color = false"
        @on-confirm="handleColorModalConfirmed"
    />

    <EditorModalVideo
        v-if="activeModals.video"
        @close-modal="activeModals.video = false"
        @on-confirm="handleVideoModalConfirmed"
    />

    <MenuBar
        v-if="showMenu"
        class="editor-header"
        :editor="editor"
        :mode="mode"
        :open-color-modal="openColorModal"
        :open-destroy-modal="openDestroyModal"
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

    .icons {
        align-items: center;
        display: flex;

        .menu-item {
            color: $primary-dark;
        }
    }
}
</style>
