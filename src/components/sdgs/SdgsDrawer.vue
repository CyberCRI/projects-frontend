<template>
  <BaseDrawer
    :confirm-action-name="$t('common.confirm')"
    :is-opened="isOpened"
    :title="$t('sdg.sdg-fulltext')"
    class="small"
    :confirm-action-disabled="isFormEqual"
    @close="checkClose"
    @confirm="confirm"
  >
    <SdgsFilter v-model="tmpModel" />
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
import SdgsFilter from '~/components/search/Filters/SdgsFilter.vue'
import BaseDrawer from '~/components/base/BaseDrawer.vue'
import { formEqual } from '~/form/base'

const props = withDefaults(
  defineProps<{
    isOpened?: boolean
  }>(),
  {
    isOpened: false,
  }
)

const { stateModals, closeModals, openModals } = useModals({ saveChange: false })

const model = defineModel<number[]>()
const tmpModel = ref([...model.value])

watch(
  () => props.isOpened,
  () => {
    tmpModel.value = [...model.value]
  },
  { immediate: true }
)

const emit = defineEmits<{
  close: []
}>()

const close = () => {
  closeModals('saveChange')
  emit('close')
}
const isFormEqual = computed(() => formEqual(model.value, tmpModel.value))

const checkClose = () => {
  if (isFormEqual.value) {
    close()
  } else {
    openModals('saveChange')
  }
}

const confirm = () => {
  model.value = tmpModel.value
  close()
}
</script>
