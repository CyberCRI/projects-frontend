<template>
  <div class="announcement">
    <div class="banner">
      <div class="creation-date">
        {{ createdDateLabel }}
      </div>
      <div v-if="!!announcement.deadline" class="deadline">
        {{ deadlineLabel }}
      </div>
      <div v-if="announcement.type && announcement.type !== 'na'" class="type">
        {{ $t(`recruit.${announcement.type}`) }}
      </div>
    </div>

    <div class="title">
      {{ announcement.$t.title }}
    </div>

    <div class="description" v-html="announcement.$t.description" />

    <div v-if="canEditAndDelete" class="action-buttons">
      <ContextActionButton
        action-icon="Pen"
        class="udpate-btn small"
        @click="$emit('update-announcement')"
      />
      <ContextActionButton
        action-icon="Close"
        class="udpate-btn small"
        @click="$emit('open-confirm-modal')"
      />
    </div>

    <div v-if="showApplyAction && !outdated" class="actions">
      <LpiButton
        btn-icon="EmailOutline"
        class="apply-btn"
        :secondary="true"
        :label="$t('recruit.apply')"
        @click="$emit('apply', announcement)"
      />
    </div>
    <div v-if="outdated" class="gradient" />
  </div>
</template>

<script setup lang="ts">
import type { TranslatedAnnouncement } from '~/models/announcement.model'

import ContextActionButton from '~/components/base/button/ContextActionButton.vue'
import LpiButton from '~/components/base/button/LpiButton.vue'

import { formatDate } from '~/functs/date'

const props = withDefaults(
  defineProps<{
    announcement: TranslatedAnnouncement
    showApplyAction?: boolean
    isInEditingMode?: boolean
  }>(),
  {
    showApplyAction: false,
    isInEditingMode: false,
  }
)

defineEmits<{
  'update-announcement': []
  'open-confirm-modal': []
  apply: [TranslatedAnnouncement]
}>()

const { locale, t } = useNuxtI18n()

const { canEditProject } = usePermissions()

const canEditAndDelete = computed(() => {
  return canEditProject.value && props.isInEditingMode
})

const createdDateLabel = computed(() => {
  const date = formatDate(new Date(props.announcement.created_at), locale.value)
  return `${t('common.added-on-the')} ${date}`
})

const deadlineLabel = computed(() => {
  const date = formatDate(new Date(props.announcement.deadline), locale.value)
  return `${t('recruit.valid-until-the')} ${date}`
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
  border: $border-width-m solid $primary-dark;
  border-radius: $border-radius-m;

  .banner {
    display: flex;
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

    .creation-date {
      background: $blue;
    }

    .deadline {
      background: $primary;
    }

    .type {
      background: $primary-dark;
    }
  }

  .title {
    margin: $space-xs 0 $space-s;
    color: $primary-dark;
    font-weight: 700;
    overflow-wrap: break-word;
  }

  .description {
    font-size: $font-size-xs;
  }

  .action-buttons {
    position: absolute;
    top: 0;
    right: 20px;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    z-index: 1;

    > button:nth-child(2) {
      margin-left: $space-m;
    }
  }

  .gradient {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: $border-radius-m;
  }

  .actions {
    padding-top: $space-m;
    display: flex;
    justify-content: flex-end;
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
