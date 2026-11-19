<template>
  <p v-for="error of errors" :key="error.$uid" class="error-description skeletons-text">
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
@use '~/design/scss/variables';

.error-description {
  color: var(--red);
  margin-top: variables.$space-s;
  font-size: variables.$font-size-s;
}
</style>
