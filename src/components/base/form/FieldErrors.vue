<template>
  <p v-for="error of errors" :key="error.$uid" class="error-description">
    {{ error.$message }}
  </p>
</template>

<script setup lang="ts">
import type { ErrorObject } from '@vuelidate/core'

defineProps<{
  errors: ErrorObject[]
}>()
</script>
<style lang="scss" scoped>
.error-description {
  color: var(--red);
  margin-top: $space-s;
  font-size: $font-size-s;
}
</style>
