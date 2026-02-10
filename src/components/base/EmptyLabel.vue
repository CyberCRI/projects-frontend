<template>
  <div class="empty">
    {{ labelEmpty }}
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    label?: string
  }>(),
  {
    label: null,
  }
)

const { t } = useNuxtI18n()

const labelEmpty = computed(() => {
  if (props.label) {
    return props.label
  }
  return t('common.empty')
})
</script>

<style scoped>
.empty {
  text-align: center;
  font-style: italic;
  opacity: 0.5;
}
</style>
