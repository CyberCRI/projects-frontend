<script setup lang="ts" generic="Item extends IconImageChoice">
import LpiButton from '~/components/base/button/LpiButton.vue'
import IconImage from '~/components/base/media/IconImage.vue'
import type { IconImageChoice } from '~/functs/IconImage'

withDefaults(
  defineProps<{
    isOpened?: boolean
    icons: Item[]
  }>(),
  { isOpened: false }
)

const emit = defineEmits<{
  close: []
}>()

const model = defineModel<IconImageChoice>({ default: null })
const tempModel = ref()

watch(model, () => (tempModel.value = model.value), { immediate: true })

const onSelect = (name: IconImageChoice) => {
  tempModel.value = name
}

const confirm = () => {
  model.value = tempModel.value
  emit('close')
}
</script>

<template>
  <BaseDrawer
    :is-opened="isOpened"
    :title="$t('tab.form.icon.select')"
    class="medium"
    :confirm-action-disabled="tempModel === model"
    @close="emit('close')"
    @confirm="confirm"
  >
    <div class="list-flow-container mt2">
      <div
        v-for="name in icons"
        :key="name"
        class="icon-choices shadow-drop"
        type="button"
        @click="onSelect(name)"
      >
        <IconImage :name="name" />
        <LpiButton v-if="tempModel === name" class="selected-icon" btn-icon="Check" />
      </div>
    </div>
  </BaseDrawer>
</template>

<style lang="scss" scoped>
.icon-choices {
  display: inline-block;
  width: 4rem;
  height: 4rem;
  cursor: pointer;
  padding: 1rem;
  border: 1px solid var(--primary-dark);
  border-radius: 10px;
  position: relative;
}

.selected-icon {
  position: absolute;
  top: 0.1rem;
  right: 0.1rem;
}
</style>
