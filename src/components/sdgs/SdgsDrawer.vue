<template>
  <BaseDrawer
    :confirm-action-name="$t('common.confirm')"
    :is-opened="isOpened"
    :title="$t('sdg.sdg-fulltext')"
    class="small"
    @close="emit('close')"
    @confirm="confirm"
  >
    <SdgsFilter v-model="tmpModel" class="sdg-grid" />
  </BaseDrawer>
</template>

<script setup lang="ts">
import BaseDrawer from '@/components/base/BaseDrawer.vue'
import SdgsFilter from '@/components/search/Filters/SdgsFilter.vue'

const props = withDefaults(
  defineProps<{
    isOpened?: boolean
  }>(),
  {
    isOpened: false,
  }
)

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

const confirm = () => {
  model.value = tmpModel.value
  emit('close')
}
</script>

<style lang="scss" scoped>
.sdg-grid {
  grid-template-columns: 1fr 1fr 1fr;
}
</style>
