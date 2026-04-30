<template>
  <div class="groups-tab">
    <div>
      <h4 class="title">
        {{ t('me.groups') }}
        <span>({{ user?.people_groups?.length || 0 }})</span>
      </h4>
      <ListPaginator :limit="listLimit" :list="user?.people_groups || []">
        <template #default="groupListSlotProps">
          <CardList
            :limit="listLimit"
            :items="groupListSlotProps.items || []"
            :is-loading="groupListSlotProps.isLoading"
          >
            <template #default="cardListSlotProps">
              <GroupCard
                v-if="cardListSlotProps.item"
                :class="{ 'is-other-org': groupIsOtherOrg(cardListSlotProps.item) }"
                :group="cardListSlotProps.item"
                @navigated-away="emit('close')"
                @click.capture="cancelIfOtherOrg($event, cardListSlotProps.item)"
              />
            </template>
            <template #empty>
              <div class="empty-ctn">
                <EmptyCard class="empty-card" :label="noGroupLabel" />
              </div>
            </template>
          </CardList>

          <div
            v-if="!groupListSlotProps.isLoading && groupListSlotProps.pagination?.total > 1"
            class="pagination-container"
          >
            <PaginationButtons
              :current="groupListSlotProps.pagination.currentPage"
              :pagination="groupListSlotProps.pagination"
              :total="groupListSlotProps.pagination.total"
              @update-pagination="groupListSlotProps.paginationAction"
            />
          </div>
        </template>
      </ListPaginator>
    </div>
  </div>
</template>

<script setup lang="ts">
import PaginationButtons from '~/components/base/navigation/PaginationButtons.vue'
import ListPaginator from '~/components/base/navigation/ListPaginator.vue'
import EmptyCard from '~/components/people/UserProfile/EmptyCard.vue'
import GroupCard from '~/components/group/GroupCard.vue'
import CardList from '~/components/base/CardList.vue'

import type { TranslatedUserModel } from '~/models/user.model'
import useUsersStore from '~/stores/useUsers'

const props = defineProps<{
  user: TranslatedUserModel
}>()

const emit = defineEmits(['close'])
const { t } = useNuxtI18n()
const usersStore = useUsersStore()
const orgStore = useOrganizations()
const listLimit = 12

const isCurrentUser = computed(() => {
  return usersStore.id === props.user.id
})

const noGroupLabel = computed(() => {
  return isCurrentUser.value ? t('me.no-group') : t('you.no-group')
})

const groupIsOtherOrg = (group) => {
  return group.organization != orgStore?.current?.code
}

const cancelIfOtherOrg = (evt, group) => {
  if (groupIsOtherOrg(group)) {
    evt.stopImmediatePropagation()
    evt.preventDefault()
  }
}
</script>

<style lang="scss" scoped>
.groups-tab {
  .loader {
    padding: $space-3xl 0;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  }

  .title {
    font-size: $font-size-l;
    font-weight: 700;
    color: $primary-dark;
    margin: $space-l 0;
  }

  .pagination-container {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.is-other-org {
  opacity: 0.6;
  filter: saturate(0);

  * {
    cursor: not-allowed !important;
  }

  &:hover {
    transform: none !important;
    box-shadow: none !important;
  }
}
</style>
