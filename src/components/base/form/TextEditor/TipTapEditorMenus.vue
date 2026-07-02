<script setup lang="ts">
import EditorModalVideo from './Custom/Video/EditorModalVideo.vue'
import EditorModalImage from './Custom/Image/EditorModalImage.vue'
import EditorModalColor from './Custom/Color/EditorModalColor.vue'
import EditorModalLink from './Custom/Link/EditorModalLink.vue'
import type { PropsDefinitions } from '~/composables/tiptap'
import type { ImageModel } from '~/models/image.model'
import type { Editor } from '@tiptap/vue-3'

withDefaults(
  defineProps<{
    editor: Editor
    showMenu: boolean
    mode: PropsDefinitions['mode']
    disableSave?: boolean
    saveIconVisible?: boolean
    saveImageCallback?: PropsDefinitions['saveImageCallback']
  }>(),
  {
    disableSave: false,
    saveIconVisible: false,
    // function must take a file argument and return a promise resolving to an {url, width, height} object
    saveImageCallback: null,
  }
)

const emit = defineEmits<{
  image: [ImageModel]
  saved: []
}>()

const { stateModals, closeModals, openAndCloseAll } = useModals({
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
    :open-color-modal="() => openAndCloseAll('color')"
    :open-image-modal="() => openAndCloseAll('image')"
    :open-link-modal="() => openAndCloseAll('link')"
    :open-video-modal="() => openAndCloseAll('video')"
    :save-icon-visible="saveIconVisible"
    :disable-save="disableSave"
    @saved="$emit('saved')"
  />

  <template v-if="showMenu && mode !== 'none'">
    <TableMenuBar v-if="mode != 'simple'" :editor="editor" class="editortablemenu" />

    <LinkMenuBar :editor="editor" class="editorlinkmenu" @open="openAndCloseAll('link')" />

    <ImageMenuBar :editor="editor" />

    <VideoMenuBar :editor="editor" />
  </template>
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
