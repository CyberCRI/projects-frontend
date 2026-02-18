<template>
  <div class="groups-tab">
    <div>
      <h4 class="title">
        {{ t('me.groups') }}
        <span>({{ user?.people_groups?.length || 0 }})</span>
      </h4>
      <ListPaginator class="paginator" :limit="listLimit" :list="user?.people_groups || []">
        <template #default="groupListSlotProps">
          <CardList
            :desktop-columns-number="6"
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

<script setup>
import CardList from '@/components/base/CardList.vue'
import GroupCard from '@/components/group/GroupCard.vue'
import EmptyCard from '@/components/people/UserProfile/EmptyCard.vue'
import ListPaginator from '@/components/base/navigation/ListPaginator.vue'
import PaginationButtons from '@/components/base/navigation/PaginationButtons.vue'
import useUsersStore from '@/stores/useUsers.ts'

defineOptions({ name: 'ProfileGroupsTab' })
const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
})

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
