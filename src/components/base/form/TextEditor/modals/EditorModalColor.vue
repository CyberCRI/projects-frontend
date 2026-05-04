<template>
  <DialogModal
    :is-small="true"
    :confirm-button-label="mode === 'add' ? $t('common.add') : $t('common.edit')"
    :cancel-button-label="$t('common.cancel')"
    @close="closeModal"
    @submit="setColor"
  >
    <template #header>
      {{
        mode === 'add' ? $t('multieditor.color.set-color') : $t('multieditor.color.change-color')
      }}
    </template>

    <template #body>
      <h5 class="inter-title">
        {{ $t('multieditor.color.pick') }}
      </h5>
      <div class="swatches">
        <span
          v-for="preset in PRESETS"
          :key="preset"
          class="swatch"
          :class="{ selected: preset == color }"
          :style="{ 'background-color': preset }"
          @click="color = preset"
        />
      </div>
      <h5 class="inter-title">
        {{ $t('multieditor.color.choose') }}
      </h5>
      <div class="pick">
        <input v-model="color" type="color" :class="{ selected: !PRESETS.includes(color) }" />
      </div>

      <h5 class="inter-title">
        {{ $t('multieditor.color.current') }}
      </h5>
      <div class="current">
        <span class="swatch" :style="{ 'background-color': color }" />
      </div>
    </template>

    <template #extra-buttons>
      <LpiButton
        v-if="mode === 'edit'"
        type="button"
        class="button-footer button-delete"
        aria-label="delete-button"
        data-test="delete-color-button"
        :label="$t('common.delete')"
        @click="removeColor"
      />
    </template>
  </DialogModal>
</template>

<script setup lang="ts">
import DialogModal from '~/components/base/modal/DialogModal.vue'
import LpiButton from '~/components/base/button/LpiButton.vue'
import type { Editor } from '@tiptap/vue-3'

const props = defineProps<{
  editor: Editor
}>()

const emit = defineEmits<{
  closeModal: []
}>()

const color = ref(undefined)
const PRESETS = [
  '#00BDA7', // Carribean green
  '#1D727C', // Ming
  '#99FFE7', // Aquamarine
  '#F0FFFB', // Mint Cream
  '#FF9473', // Light Salmon
  '#FFCC00', // Sun glow
  '#D6A2FF', // Mauve
  '#6CD5FF', // Baby Blue
  '#FF3C00', // Coquelicot
]

const currentColor = computed(() => props.editor.getAttributes('textStyle').color)
const mode = computed(() => (currentColor.value !== undefined ? 'edit' : 'add'))

onMounted(() => {
  color.value = currentColor.value || '#000000'
})

const closeModal = () => emit('closeModal')
const handleColorModalConfirmed = (data) => {
  if (data) {
    props.editor.chain().focus().setColor(data).run()
  } else {
    props.editor.chain().focus().unsetColor().run()
  }

  closeModal()
}

const setColor = () => handleColorModalConfirmed(color.value)
const removeColor = () => handleColorModalConfirmed(null)
</script>

<style lang="scss" scoped>
.button-delete {
  color: $white;
  background: $salmon;
}

.inter-title {
  text-align: center;
  margin-bottom: $space-m;
  margin-top: $space-xl;
}

.swatches {
  display: flex;
  gap: $space-m;
  justify-content: center;
}

.current,
.pick {
  display: flex;
  justify-content: center;
}

.swatch,
[type='color'] {
  display: inline-block;
  width: $layout-size-3xl;
  height: $layout-size-3xl;
  border: 2px solid transparent;
  background: none;
  padding: 2px;
  cursor: pointer;
}

[type='color'] {
  width: 54px;
  height: 54px;
}

.selected {
  border: 2px solid black;
}
</style>
