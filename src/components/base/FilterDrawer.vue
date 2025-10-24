<template>
  <Drawer
    :confirm-action-name="$t('common.confirm')"
    :is-opened="open"
    :title="title"
    class="small"
    @close="close"
    @confirm="confirm"
  >
    <FilterEditor v-model="values" :options="options" />
  </Drawer>
</template>

<script setup>
import Drawer from '@/components/base/BaseDrawer.vue'
import FilterEditor from '@/components/base/form/FilterEditor.vue'

defineOptions({ name: 'FilterDrawer' })

defineProps({
  options: {
    type: Array,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
})
const open = defineModel('open', { required: true, type: Boolean })
const modelValue = defineModel('modelValue', { required: true, type: Array })
const emit = defineEmits(['update:modelValue', 'update:open'])

const values = ref([])

// reset selected values when drawer is closed or default select value are changed
watch(modelValue, () => {
  values.value = [...modelValue.value]
})
watch(open, () => {
  values.value = [...modelValue.value]
})

const close = () => {
  emit('update:open', false)
}

const confirm = () => {
  emit('update:modelValue', [...values.value])
  close()
}
</script>
