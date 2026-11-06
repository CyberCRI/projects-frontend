<template>
  <div v-if="group.structure" class="badge-list">
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
import type { TranslatedPeopleGroupModel } from 'shared-projects-frontend/models'
import { GROUP_MODULE_ICON, GROUP_MODULE_TITLE } from '~/functs/constants'
import { NuxtLink } from '#components'

const { t } = useNuxtI18n()
const props = defineProps<{ group: TranslatedPeopleGroupModel }>()

const badges = computed(() => {
  const res = []
  if (props.group.modules.projects)
    res.push({
      label: t(GROUP_MODULE_TITLE.projects, props.group.modules.projects),
      icon: GROUP_MODULE_ICON.projects,
      count: props.group.modules.projects,
      link: `/group/${props.group.slug || props.user.id}/projects`,
    })
  if (props.group.structure?.modules.conferences) {
    res.push({
      label: t(GROUP_MODULE_TITLE.conferences, props.group.structure.modules.conferences),
      icon: GROUP_MODULE_ICON.conferences,
      count: props.group.structure?.modules.conferences,
      link: `/group/${props.group.slug || props.group.id}/documents/conferences`,
    })
  }
  if (props.group.structure?.modules.publications) {
    res.push({
      label: t(GROUP_MODULE_TITLE.publications, props.group.structure.modules.publications),
      icon: GROUP_MODULE_ICON.publications,
      count: props.group.structure?.modules.publications,
      link: `/group/${props.group.slug || props.group.id}/documents/publication`,
    })
  }
  if (props.group.structure?.modules.affiliated) {
    res.push({
      label: t(GROUP_MODULE_TITLE.affiliated, props.group.structure.modules.affiliated),
      icon: GROUP_MODULE_ICON.affiliated,
      count: props.group.structure?.modules.affiliated,
      link: `/group/${props.group.slug || props.group.id}/affiliate`,
    })
  }
  if (props.group.structure?.modules.teachings) {
    res.push({
      label: t(GROUP_MODULE_TITLE.teachings, props.group.structure.modules.teachings),
      icon: GROUP_MODULE_ICON.teachings,
      count: props.group.structure?.modules.teachings,
      link: `/group/${props.group.slug || props.group.id}/teaching`,
    })
  }
  if (props.group.structurer?.modules.awards) {
    res.push({
      label: t(GROUP_MODULE_TITLE.awards, props.group.structure.modules.awards),
      icon: GROUP_MODULE_ICON.awards,
      count: props.group.structure?.modules.awards,
      link: `/group/${props.group.slug || props.group.id}/awards`,
    })
  }

  if (props.group.structure?.modules.patents) {
    res.push({
      label: t(GROUP_MODULE_TITLE.patents, props.group.structure.modules.patents),
      icon: GROUP_MODULE_ICON.patents,
      count: props.group.structure?.modules.patents,
      link: `/group/${props.user.slug || props.user.id}/patents`,
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
