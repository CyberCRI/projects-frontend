<template>
  <BaseDrawer
    :confirm-action-name="$t('common.confirm')"
    :is-opened="isOpened"
    :title="$t('project.form.add-tags')"
    class="medium"
    @close="close"
    @confirm="confirm"
  >
    <TagsFilterEditor v-model="tmpModel" :use-projects="false" hide-current-tags-separator />
  </BaseDrawer>
</template>

<script setup lang="ts">
import BaseDrawer from '@/components/base/BaseDrawer.vue'
import { TagModel } from '@/models/tag.model'

const props = withDefaults(
  defineProps<{
    isOpened?: boolean
  }>(),
  {
    isOpened: false,
  }
)

const model = defineModel<TagModel[]>()
const tmpModel = ref<TagModel[]>([])

watch(
  () => props.isOpened,
  () => {
    tmpModel.value = [...model.value]
  },
  { immediate: true }
)

const emit = defineEmits(['close', 'confirm'])

const close = () => emit('close')
const confirm = () => {
  model.value = tmpModel.value
  emit('confirm')
  emit('close')
}
</script>
