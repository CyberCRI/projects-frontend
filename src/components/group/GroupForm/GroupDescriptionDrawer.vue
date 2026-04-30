<template>
  <BaseDrawer
    :confirm-action-name="$t('common.save')"
    :is-opened="isOpened"
    :title="$t('group.form.add-description')"
    class="group-drawer"
    @close="close"
    @confirm="saveDescription"
  >
    <ConfirmModal
      v-if="confirmModalIsOpen"
      content=""
      :title="$t('description.quit-without-saving-title')"
      :confirm-button-label="$t('common.continue')"
      @cancel="confirmModalIsOpen = false"
      @confirm="closeDrawer"
    />

    <div class="editor-ctn">
      <TipTapEditor
        ref="tiptapEditor"
        v-model="description"
        class="input-field content-editor no-max-height min-height-100"
        mode="medium"
        @image="handleImage"
      />
    </div>
  </BaseDrawer>
</template>

<script setup lang="ts">
import TipTapEditor from '@/components/base/form/TextEditor/TipTapEditor.vue'
import ConfirmModal from '@/components/base/modal/ConfirmModal.vue'
import BaseDrawer from '@/components/base/BaseDrawer.vue'
import { NULL_CONTENT } from '~/functs/constants'

const props = withDefaults(
  defineProps<{
    isOpened?: boolean
    originalDescription?: string
  }>(),
  {
    isOpened: false,
    originalDescription: null,
  }
)

const emit = defineEmits<{
  close: []
  'update-description': [string]
}>()

const description = ref(NULL_CONTENT)
const addedImages = ref([])
const confirmModalIsOpen = ref(false)

watch(
  () => props.isOpened,
  (neo) => {
    if (neo) {
      description.value = props.originalDescription || NULL_CONTENT
    }
  },
  { immediate: true }
)

const close = () => emit('close')

const closeDrawer = () => {
  confirmModalIsOpen.value = false
  emit('close')
}

const saveDescription = () => {
  emit('update-description', description.value)
  close()
}

const handleImage = (img) => {
  addedImages.value.push(img.id)
}
</script>

<style lang="scss" scoped>
.group-drawer {
  height: 100%;

  .input-field {
    margin: $space-l;
    margin-bottom: $space-xs;
  }

  .content-editor {
    flex-grow: 1;
    min-height: pxToRem(300px);
  }
}

.editor-ctn {
  flex-grow: 1;
  display: flex;
  flex-flow: column;
  justify-content: stretch;
  overflow: hidden;
}
</style>
