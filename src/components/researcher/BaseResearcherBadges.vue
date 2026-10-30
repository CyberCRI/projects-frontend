<template>
  <div v-if="user.researcher" class="badge-list">
    <template v-for="badge in badges" :key="badge.label">
      <NuxtLink v-if="badge.link" :to="badge.link" class="badge">
        <IconImage class="badge-icon" :name="badge.icon" />
        <span class="badge-label">
          {{ $t(`researcher.badges.${badge.label}`, { count: badge.count }) }}
        </span>
      </NuxtLink>
      <div v-else class="badge">
        <IconImage class="badge-icon" :name="badge.icon" />
        <span class="badge-label">
          {{ $t(`researcher.badges.${badge.label}`, { count: badge.count }) }}
        </span>
      </div>
    </template>
  </div>
</template>
<script lang="ts" setup>
import type { TranslatedUserModel } from 'shared-projects-frontend/models'

const props = defineProps<{ user: TranslatedUserModel }>()

const badges = computed(() => {
  const res = []
  if (props.user.modules.projects)
    res.push({
      label: 'projects',
      icon: 'Briefcase',
      count: props.user.modules.projects,
      link: `/profile/${props.user.slug || props.user.id}/projects`,
    })
  if (props.user.researcher?.modules.publications)
    res.push({
      label: 'publications',
      icon: 'BookLine',
      count: props.user.researcher?.modules.publications,
      link: `/profile/${props.user.slug || props.user.id}/documents/publication`,
    })
  if (props.user.researcher?.modules.affiliated)
    res.push({
      label: 'affiliated',
      icon: 'AccountCircle',
      count: props.user.researcher?.modules.affiliated,
      link: `/profile/${props.user.slug || props.user.id}/affiliate`,
    })
  // TODO:
  res.push({
    label: 'teachings',
    icon: 'SchoolOutline',
    count: 2,
    link: `/profile/${props.user.slug || props.user.id}/teaching`,
  })
  if (props.user.researcher?.modules.awards)
    res.push({
      label: 'awards',
      icon: 'Licence',
      count: props.user.researcher?.modules.awards,
      link: `/profile/${props.user.slug || props.user.id}/awards`,
    })

  return res
})
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
  font-weight: 600;
  color: variables.$primary-dark;
}
</style>
