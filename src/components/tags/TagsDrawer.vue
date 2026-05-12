<template>
  <BaseDrawer
    :confirm-action-name="$t('common.confirm')"
    :is-opened="isOpened"
    :title="$t('project.form.add-tags')"
    class="medium"
    @close="checkClose"
    @confirm="confirm"
  >
    <TagsFilterEditor v-model="tmpModel" :use-projects="false" hide-current-tags-separator />
  </BaseDrawer>
  <ConfirmModal
    v-if="stateModals.saveChange"
    :title="$t('form.quit-without-saving-title')"
    :content="$t('common.confirm-close')"
    @cancel="closeModals('saveChange')"
    @confirm="close"
  />
</template>

<script setup lang="ts">
import type { TagModel } from '~/models/tag.model'

import ConfirmModal from '~/components/base/modal/ConfirmModal.vue'
import BaseDrawer from '~/components/base/BaseDrawer.vue'
import { isEqual } from 'es-toolkit'

const props = withDefaults(
  defineProps<{
    isOpened?: boolean
  }>(),
  {
    isOpened: false,
  }
)

const { stateModals, closeModals, openModals } = useModals({ saveChange: false })
const model = defineModel<TagModel[]>()
const tmpModel = ref<TagModel[]>([])

watch(
  () => props.isOpened,
  () => {
    tmpModel.value = [...model.value]
  },
  { immediate: true }
)

const close = () => {
  closeModals('saveChange')
  emit('close')
}
const emit = defineEmits(['close', 'confirm'])

const checkClose = () => {
  if (isEqual(model.value, tmpModel.value)) {
    close()
  } else {
    openModals('saveChange')
  }
}
const confirm = () => {
  model.value = tmpModel.value
  emit('confirm')
  close()
}
</script>
