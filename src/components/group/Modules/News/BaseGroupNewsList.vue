<template>
  <FetchLoader :status="status" only-error skeleton>
    <BaseModuleHeader
      v-if="!preview"
      :pagination="pagination"
      :editable="editable"
      @add="onCreate"
    />
    <div class="list-container">
      <div class="list-divider">
        <NewsItem
          v-for="news in data"
          :key="news.title"
          :news="news"
          :editable="editable"
          @edit="onEditNews"
          @delete="onDeleteNews"
        />
      </div>
      <NothingHere v-if="data.length === 0" />
      <PaginationButtonsV2 v-if="!preview" :pagination="pagination" />
    </div>
  </FetchLoader>
  <!-- drawer/modal -->

  <EditNewsDrawer
    :is-opened="stateModals.edit"
    :news="selectedNews"
    :selected-group="false"
    @close="onCancel"
    @news-edited="onAfterEdit"
  />

  <ConfirmModal
    v-if="stateModals.delete"
    :title="$t('news.delete.message')"
    @confirm="onConfirmDeleteNews"
    @cancel="onCancel"
  >
    <NewsItem v-if="selectedNews" :news="selectedNews" />
  </ConfirmModal>
</template>

<script setup lang="ts">
import type { TranslatedPeopleGroupModel } from '~/models/invitation.model'
import type { QueryFilterNews, TranslatedNews } from '~/models/news.model'

import { getGroupNews } from '~/api/v2/group.service'
import { deleteNews } from '~/api/news.service'

import EditNewsDrawer from '~/components/news/EditNewsDrawer/EditNewsDrawer.vue'
import FetchLoader from '~/components/base/FetchLoader.vue'
import NewsItem from '~/components/news/NewsItem.vue'

import useToasterStore from '~/stores/useToaster'

import { factoryPagination, maxSkeleton } from '~/skeletons/base.skeletons'
import BaseModuleHeader from '~/components/modules/BaseModuleHeader.vue'
import NothingHere from '~/components/base/NothingHere.vue'
import { newsSkeleton } from '~/skeletons/news.skeletons'

const props = withDefaults(
  defineProps<{
    group: TranslatedPeopleGroupModel
    limit?: number
    editable?: boolean
    preview?: boolean
  }>(),
  {
    limit: null,
    editable: false,
    preview: false,
  }
)

const { t } = useNuxtI18n()

const selectedNews = ref<any>()
const { stateModals, openModals, closeModals } = useModals({ delete: false, edit: false })
const toaster = useToasterStore()
const organizationCode = useOrganizationCode()
const groupId = computed(() => props.group?.id)

const { query } = useQuery<QueryFilterNews>({})

const limitSkeletons = computed(() => maxSkeleton(props.group?.modules?.news, props.limit))

const { status, data, pagination, refresh } = getGroupNews(organizationCode, groupId, {
  query,
  paginationConfig: {
    limit: props.limit,
  },
  default: () => factoryPagination(newsSkeleton, limitSkeletons.value),
})

const onEditNews = (news: TranslatedNews) => {
  selectedNews.value = news
  openModals('edit')
}
const onCreate = () => {
  selectedNews.value = {
    people_groups: [props.group.id],
  }
  openModals('edit')
}

const onDeleteNews = (news: TranslatedNews) => {
  selectedNews.value = news
  openModals('delete')
}
const onConfirmDeleteNews = () => {
  deleteNews(organizationCode, selectedNews.value.id)
    .then(() => {
      toaster.pushSuccess(t('news.delete.success'))
      onAfterEdit()
    })
    .catch(() => toaster.pushError(t('news.delete.error')))
    .finally(() => onCancel())
}

const onAfterEdit = () => {
  refreshNuxtData([
    `${organizationCode}::group::${props.group.slug}`,
    `${organizationCode}::group::${props.group.id}`,
  ])
  refresh()
  onCancel()
}

const onCancel = () => {
  selectedNews.value = null
  closeModals('edit', 'delete')
}
</script>
