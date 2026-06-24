<script setup lang="ts">
import type { PropsDefinitions } from '~/components/base/form/TextEditor/useTipTap'
import ColorMenuBar from '~/components/base/form/TextEditor/ColorMenuBar.vue'
import type { ImageModealCreated } from '~/models/image.model.js'
import EditorModalVideo from './modals/EditorModalVideo.vue'
import EditorModalImage from './modals/EditorModalImage.vue'
import EditorModalColor from './modals/EditorModalColor.vue'
import EditorModalLink from './modals/EditorModalLink.vue'
import VideoMenuBar from './VideoMenuBar.vue'
import TableMenuBar from './TableMenuBar.vue'
import ImageMenuBar from './ImageMenuBar.vue'
import LinkMenuBar from './LinkMenuBar.vue'
import type { Editor } from '@tiptap/vue-3'
import type MenuBar from './MenuBar.vue'

const emit = defineEmits(['image', 'saved'])

withDefaults(
  defineProps<{
    editor: Editor
    showMenu: boolean
    mode: PropsDefinitions['mode']
    disableSave?: boolean
    saveIconVisible?: boolean
    saveImageCallback?: (file: File) => Promise<ImageModealCreated>
  }>(),
  {
    disableSave: false,
    saveIconVisible: false,
    // function must take a file argument and return a promise resolving to an {url, width, height} object
    saveImageCallback: null,
  }
)

const { stateModals, closeModals, openModals } = useModals({
  image: false,
  link: false,
  video: false,
  color: false,
})
</script>

<template>
  <EditorModalImage
    v-if="stateModals.image"
    :editor="editor"
    :save-image-callback="saveImageCallback"
    @close="closeModals('image')"
    @image="emit('image', $event)"
  />

  <EditorModalLink v-if="stateModals.link" :editor="editor" @close="closeModals('link')" />

  <EditorModalColor v-if="stateModals.color" :editor="editor" @close="closeModals('color')" />

  <EditorModalVideo v-if="stateModals.video" :editor="editor" @close="closeModals('video')" />

  <MenuBar
    v-if="showMenu"
    class="editor-header"
    :editor="editor"
    :mode="mode"
    :open-color-modal="() => openModals('color')"
    :open-image-modal="() => openModals('image')"
    :open-link-modal="() => openModals('link')"
    :open-video-modal="() => openModals('video')"
    :save-icon-visible="saveIconVisible"
    :disable-save="disableSave"
    @saved="$emit('saved')"
  />

  <TableMenuBar
    v-if="showMenu && !['none', 'simple'].includes(mode)"
    :editor="editor"
    class="editortablemenu"
  />

  <LinkMenuBar
    v-if="showMenu && mode !== 'none'"
    :editor="editor"
    class="editorlinkmenu"
    @open="openModals('link')"
  />

  <ImageMenuBar v-if="showMenu && mode !== 'none'" :editor="editor" />

  <VideoMenuBar v-if="showMenu && mode !== 'none'" :editor="editor" />
</template>

<style lang="scss" scoped>
.editor-header {
  background: $white;
  color: $primary-dark;
  display: flex;
  padding: 5px 20px;
  width: 100%;
  justify-content: space-between;
  border-bottom: $border-width-s solid $primary;
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
