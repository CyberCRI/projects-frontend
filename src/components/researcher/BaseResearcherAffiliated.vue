<template>
  <div v-if="user.researcher">
    <div class="affiliates">
      <UserRow v-for="affiliate in affiliates" :key="affiliate.id" :user="affiliate" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import type { TranslatedUserModel } from 'shared-projects-frontend/models'

const props = defineProps<{ user: TranslatedUserModel }>()

const affiliates = computed(() => [
  { ...props.user, id: 1 },
  { ...props.user, id: 2 },
  { ...props.user, id: 3 },
  { ...props.user, id: 4 },
])
</script>
<style lang="scss" scoped>
@use '~/design/scss/variables';

.affiliates {
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr 1fr;
}
</style>
