<template>
  <div class="group-members">
    <div class="members">
      <div class="members-header">
        <h2 class="title">
          {{ $t('group.group-members') }}
          <span v-show="countElement">( {{ countElement }} )</span>
        </h2>
      </div>
      <div class="container">
        <BaseMembersPreview :group="group" :limit="DEFAULT_PAGINATION_LIMIT" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseMembersPreview from '@/components/group/Modules/Members/BaseMembersPreview.vue'
import { DEFAULT_PAGINATION_LIMIT } from '@/composables/usePagination'
import { TranslatedPeopleGroupModel } from '@/models/invitation.model'

defineOptions({ name: 'GroupMembersTab' })

const props = defineProps<{
  group: TranslatedPeopleGroupModel
}>()

const countElement = computed<number>(() => props.group.modules?.members)
</script>

<style lang="scss" scoped>
.group-members {
  .members {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: $space-xl;

    &-header {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      width: 100%;
      gap: $space-l;

      .title {
        font-weight: 700;
        font-size: $font-size-l;
        color: $primary-dark;
      }
    }
  }
}

.container {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}
</style>
