<template>
  <component
    :is="is"
    :id="`announcement:${announcement.id}`"
    class="announcement"
    :class="{
      outdated,
    }"
    :to="{
      name: 'projectAnnouncements',
      params: { slugOrId: project.slug || project.id },
      hash: `#announcement:${announcement.id}`,
    }"
  >
    <h2 class="title skeletons-text">
      <div class="banner">
        <div v-if="announcement.type && announcement.type !== 'na'" class="type skeletons-text">
          {{ $t(`recruit.${announcement.type}`) }}
        </div>
      </div>
      {{ announcement.$t.title }}
    </h2>

    <ContentExpandable
      :description="announcement.$t.description"
      :opened="stateModals.showMore"
      hide-see-more
      :height-limit="100"
      @limited="setModals('expandableIsEnabled', $event)"
    />
    <div class="announcement-date skeletons-text">
      {{ dateLabel }}
    </div>

    <div class="action-buttons">
      <ContextActionMenuInline
        :can-delete="canEditAndDelete"
        :can-edit="canEditAndDelete"
        @edit="$emit('edit')"
        @delete="$emit('delete')"
      />
    </div>

    <div class="actions">
      <LpiButton
        v-if="stateModals.expandableIsEnabled && showSeeMore"
        secondary
        class="no-border"
        :btn-icon="!stateModals.showMore ? 'ChevronDown' : 'ChevronUp'"
        :label="!stateModals.showMore ? $t('common.see-more') : $t('common.see-less')"
        @click.prevent="toggleModals('showMore')"
      >
        {{ !stateModals.showMore ? $t('common.see-more') : $t('common.see-less') }}
      </LpiButton>
      <div v-else />

      <LpiButton
        v-if="showApplyAction && !outdated"
        btn-icon="EmailOutline"
        class="apply-btn"
        :secondary="true"
        :label="$t('recruit.apply')"
        @click="$emit('apply', announcement)"
      />
    </div>
  </component>
</template>

<script setup lang="ts">
import type { TranslatedAnnouncement, TranslatedProject } from 'shared-projects-frontend/models'

import LpiButton from '~/components/base/button/LpiButton.vue'

import ContextActionMenuInline from '~/components/base/button/ContextActionMenuInline.vue'
import { usePermissionProject } from '~/composables/usePermissions/useProjectPermissions'
import ContentExpandable from '~/components/base/ContentExpandable.vue'
import { dateWithoutHours, formatDate, nowDate } from '~/functs/date'

const props = withDefaults(
  defineProps<{
    project: TranslatedProject
    announcement: TranslatedAnnouncement
    showApplyAction?: boolean
    editable?: boolean
    showMore?: boolean
    is?: string | Component
    showSeeMore?: boolean
  }>(),
  {
    showApplyAction: false,
    editable: false,
    showMore: false,
    is: 'div',
    showSeeMore: true,
  }
)

defineEmits<{
  edit: []
  delete: []
  apply: [TranslatedAnnouncement]
}>()

const { locale, t } = useNuxtI18n()

const { canEditProject } = usePermissionProject(computed(() => props.project.id))

const { stateModals, toggleModals, setModals } = useModals({
  showMore: false,
  expandableIsEnabled: false,
})
watch(
  () => props.showMore,
  () => setModals('showMore', props.showMore),
  { immediate: true }
)

const canEditAndDelete = computed(() => {
  return canEditProject.value && props.editable
})

const dateLabel = computed(() => {
  if (!props.announcement.deadline) {
    return
  }

  const deadline = dateWithoutHours(props.announcement.deadline)
  const now = nowDate()

  if (deadline < now) {
    return t('recruit.outdated')
  }

  return `${t('recruit.valid-until-the')} ${formatDate(deadline, locale.value)}`
})

const outdated = computed(() => {
  if (!props.announcement.deadline) return false
  const endDate = new Date(props.announcement.deadline)
  // deadline is inclusive, so we set the time to the end of the day
  endDate.setHours(23, 59, 59, 999)
  return endDate < new Date()
})
</script>

<style lang="scss" scoped>
@use '~/design/scss/variables';

.announcement {
  position: relative;
  padding: variables.$space-m variables.$space-s;
  border: variables.$border-width-m solid var(--primary-dark);
  border-radius: variables.$border-radius-m;

  .banner {
    display: inline-flex;
    align-items: center;
    color: variables.$white;
    border-radius: variables.$border-radius-s;
    overflow: hidden;
    border: variables.$border-width-s solid variables.$white;
    font-size: variables.$font-size-xs;
    width: fit-content;

    > div {
      padding: variables.$space-2xs variables.$space-xs;
    }

    font-weight: 500;

    .type {
      background: var(--blue);
      color: var(--black);
    }
  }

  .title {
    color: variables.$primary-dark;
    font-weight: 700;
    font-size: 1.5rem;
    overflow-wrap: break-word;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .description {
    font-size: variables.$font-size-xs;
  }

  .announcement-date {
    font-style: italic;
    color: var(--black);
    opacity: 0.7;
  }

  .action-buttons {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    display: flex;
    align-items: center;
    z-index: 1;

    > button:nth-child(2) {
      margin-left: variables.$space-m;
    }
  }

  .actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}

:deep(.description) {
  strong {
    font-weight: 700 !important;
  }

  em {
    font-style: italic;
  }

  u {
    text-decoration: underline;
  }

  a {
    color: variables.$primary-dark;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
