<template>
  <div class="profile-edit-group">
    <div class="form-group">
      <label>
        {{ $t('profile.edit.groups.groups.label') }} ({{ user?.people_groups?.length || 0 }})
      </label>
      <div class="group-list-list">
        <ListPaginator :limit="listLimit" :list="user?.people_groups || []">
          <template #default="groupListSlotProps">
            <CardList
              :desktop-columns-number="4"
              :limit="listLimit"
              :items="groupListSlotProps.items"
              :is-loading="groupListSlotProps.isLoading"
            >
              <template #default="cardListSlotProps">
                <GroupCard v-if="cardListSlotProps.item" :group="cardListSlotProps.item" />
              </template>
              <template #empty>
                <div class="empty-ctn" :class="gridLayout">
                  <EmptyCard class="empty-card" :label="$t('me.no-group')" />
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
  </div>
</template>
<script>
import CardList from '@/components/base/CardList.vue'
import GroupCard from '@/components/group/GroupCard.vue'
import EmptyCard from '@/components/people/UserProfile/EmptyCard.vue'
import ListPaginator from '@/components/base/navigation/ListPaginator.vue'
import PaginationButtons from '@/components/base/navigation/PaginationButtons.vue'

export default {
  name: 'ProfileGroupsEditTab',
  components: {
    CardList,
    GroupCard,
    EmptyCard,
    ListPaginator,
    PaginationButtons,
  },

  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      listLimit: 12,
    }
  },
}
</script>
<style scoped lang="scss">
@import './profile-form';

.pagination-container {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
