<template>
  <div v-if="user.researcher" class="badge-list">
    <template v-for="badge in badges" :key="badge.label">
      <component :is="badge.link ? NuxtLink : 'div'" :to="badge.link" class="badge">
        <IconImage class="badge-icon" :name="badge.icon" />
        <span class="badge-label">
          {{ badge.label }}
        </span>
      </component>
    </template>
  </div>
</template>
<script lang="ts" setup>
import type { TranslatedUserModel } from 'shared-projects-frontend/models'
import { USER_MODULE_ICON, USER_MODULE_TITLE } from '~/functs/constants'
import { NuxtLink } from '#components'

const { t } = useNuxtI18n()
const props = defineProps<{ user: TranslatedUserModel }>()

const badges = computed(() => {
  const res = []
  if (props.user.modules.projects)
    res.push({
      label: t(USER_MODULE_TITLE.projects, props.user.modules.projects),
      icon: USER_MODULE_ICON.projects,
      count: props.user.modules.projects,
      link: `/profile/${props.user.slug || props.user.id}/projects`,
    })
  if (props.user.researcher?.modules.conferences) {
    res.push({
      label: t(USER_MODULE_TITLE.conferences, props.user.researcher.modules.conferences),
      icon: USER_MODULE_ICON.conferences,
      count: props.user.researcher?.modules.conferences,
      link: `/profile/${props.user.slug || props.user.id}/documents/conferences`,
    })
  }
  if (props.user.researcher?.modules.publications) {
    res.push({
      label: t(USER_MODULE_TITLE.publications, props.user.researcher.modules.publications),
      icon: USER_MODULE_ICON.publications,
      count: props.user.researcher?.modules.publications,
      link: `/profile/${props.user.slug || props.user.id}/documents/publication`,
    })
  }
  if (props.user.researcher?.modules.affiliated) {
    res.push({
      label: t(USER_MODULE_TITLE.affiliated, props.user.researcher.modules.affiliated),
      icon: USER_MODULE_ICON.affiliated,
      count: props.user.researcher?.modules.affiliated,
      link: `/profile/${props.user.slug || props.user.id}/affiliate`,
    })
  }
  if (props.user.researcher?.modules.teachings) {
    res.push({
      label: t(USER_MODULE_TITLE.teachings, props.user.researcher.modules.teachings),
      icon: USER_MODULE_ICON.teachings,
      count: props.user.researcher?.modules.teachings,
      link: `/profile/${props.user.slug || props.user.id}/teaching`,
    })
  }
  if (props.user.researcher?.modules.awards) {
    res.push({
      label: t(USER_MODULE_TITLE.awards, props.user.researcher.modules.awards),
      icon: USER_MODULE_ICON.awards,
      count: props.user.researcher?.modules.awards,
      link: `/profile/${props.user.slug || props.user.id}/awards`,
    })
  }

  if (props.user.researcher?.modules.patents) {
    res.push({
      label: t(USER_MODULE_TITLE.patents, props.user.researcher.modules.patents),
      icon: USER_MODULE_ICON.patents,
      count: props.user.researcher?.modules.patents,
      link: `/profile/${props.user.slug || props.user.id}/patents`,
    })
  }

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
