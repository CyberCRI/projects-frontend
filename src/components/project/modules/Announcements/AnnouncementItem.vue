<template>
  <div
    class="announcement"
    :class="{
      outdated,
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

    <TipTapOutput
      class="description tiptap-output skeletons-text"
      :content="announcement.$t.description"
    />

    <div class="action-buttons">
      <ContextActionMenuInline
        :can-delete="canEditAndDelete"
        :can-edit="canEditAndDelete"
        @edit="$emit('edit')"
        @delete="$emit('delete')"
      />
    </div>

    <div class="actions">
      <div class="announcement-date">
        {{ dateLabel }}
      </div>
      <LpiButton
        v-if="showApplyAction && !outdated"
        btn-icon="EmailOutline"
        class="apply-btn"
        :secondary="true"
        :label="$t('recruit.apply')"
        @click="$emit('apply', announcement)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TranslatedAnnouncement } from '~/models/announcement.model'

import LpiButton from '~/components/base/button/LpiButton.vue'

import ContextActionMenuInline from '~/components/base/button/ContextActionMenuInline.vue'
import { dateWithoutHours, formatDate, nowDate } from '~/functs/date'

const props = withDefaults(
  defineProps<{
    announcement: TranslatedAnnouncement
    showApplyAction?: boolean
    editable?: boolean
  }>(),
  {
    showApplyAction: false,
    editable: false,
  }
)

defineEmits<{
  edit: []
  delete: []
  apply: [TranslatedAnnouncement]
}>()

const { locale, t } = useNuxtI18n()

const { canEditProject } = usePermissions()

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
.announcement {
  position: relative;
  padding: $space-m $space-s;
  border: $border-width-m solid var(--primary-dark);
  border-radius: $border-radius-m;

  .banner {
    display: inline-flex;
    align-items: center;
    color: $white;
    border-radius: $border-radius-s;
    overflow: hidden;
    border: $border-width-s solid $white;
    font-size: $font-size-xs;
    width: fit-content;

    > div {
      padding: $space-2xs $space-xs;
    }

    font-weight: 500;

    .type {
      background: var(--blue);
      color: var(--black);
    }
  }

  .title {
    color: $primary-dark;
    font-weight: 700;
    font-size: 1.5rem;
    overflow-wrap: break-word;
  }

  .description {
    font-size: $font-size-xs;
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
      margin-left: $space-m;
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
    color: $primary-dark;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
