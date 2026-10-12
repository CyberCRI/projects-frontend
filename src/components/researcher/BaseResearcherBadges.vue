<template>
  <div v-if="user.researcher" class="badge-list">
    <div v-for="badge in badges" :key="badge.label" class="badge">
      <IconImage class="badge-icon" :name="badge.icon" />
      <span class="badge-label">
        {{ $t(`researcher.badges.${badge.label}`, { count: badge.count }) }}
      </span>
    </div>
  </div>
</template>
<script lang="ts" setup>
import type { TranslatedUserModel } from 'shared-projects-frontend/models'

defineProps<{ user: TranslatedUserModel }>()

const badges = ref([
  { label: 'projects', icon: 'Briefcase', count: 5 },
  { label: 'publications', icon: 'BookLine', count: 38 },
  { label: 'affiliated', icon: 'AccountCircle', count: 7 },
  { label: 'teachings', icon: 'SchoolOutline', count: 2 },
  { label: 'awards', icon: 'Licence', count: 10 },
])
</script>
<style lang="scss" scoped>
@use '~/design/scss/variables';

.badge-list {
  display: flex;
  justify-content: center;
  gap: 1rem;
  background-color: variables.$primary-lighter;
  padding: 0.5rem 1rem;
}

.badge {
  display: flex;
  gap: 0.6rem;
  align-items: center;
}

.badge-icon {
  width: 1.5rem;
  height: 1.5rem;
  fill: variables.$primary;
}

.badge-label {
  font-weight: 700;
  color: variables.$primary-dark;
}
</style>
