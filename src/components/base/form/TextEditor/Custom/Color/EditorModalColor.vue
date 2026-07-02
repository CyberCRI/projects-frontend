<template>
  <DialogModal
    :is-small="true"
    :confirm-button-label="mode === 'add' ? $t('common.add') : $t('common.edit')"
    :cancel-button-label="$t('common.cancel')"
    @close="emit('close')"
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
          v-for="item in DEFAULT_COLOR_TIPTAP"
          :key="item.color"
          class="swatch"
          :class="{ selected: item.color == color }"
          :style="{ 'background-color': item.color }"
          :title="t(item.label)"
          @click="color = item.color"
        />
      </div>
      <h5 class="inter-title">
        {{ $t('multieditor.color.choose') }}
      </h5>
      <div class="pick">
        <input
          v-model="color"
          type="color"
          :class="{ selected: !DEFAULT_COLOR_TIPTAP.includes(color) }"
        />
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
import { DEFAULT_COLOR_TIPTAP } from '~/functs/constants'
import type { Editor } from '@tiptap/vue-3'

const props = defineProps<{
  editor: Editor
}>()

const emit = defineEmits<{
  close: []
}>()

const { t } = useNuxtI18n()
const color = ref(undefined)
const mode = ref<'edit' | 'add'>()
onMounted(() => {
  const currentColor = props.editor.getAttributes('textStyle').color
  mode.value = currentColor ? 'edit' : 'add'
  color.value = currentColor || '#000000'
})

const setColor = () => {
  props.editor.chain().focus().setColor(color.value).run()
  emit('close')
}
const removeColor = () => {
  props.editor.chain().focus().unsetColor().run()
  emit('close')
}
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
