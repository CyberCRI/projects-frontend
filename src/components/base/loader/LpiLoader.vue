<template>
  <div>
    <LoaderSimple v-if="type === 'simple'" />
    <LoaderComplex v-if="type === 'complex'" />
  </div>
</template>

<script setup lang="ts">
import LoaderSimple from '@/components/base/loader/LoaderSimple.vue'
import LoaderComplex from '@/components/base/loader/LoaderComplex.vue'

defineProps<{
  type: 'simple' | 'complex'
}>()
</script>
