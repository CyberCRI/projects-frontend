<template>
  <FetchLoader :status="status" only-error skeleton>
    <div class="list-container">
      <LpiButton
        v-if="editable"
        btn-icon="Plus"
        :label="$t('group.form.add')"
        class="edit-btn skeletons-background"
        @click="onCreate"
      />
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

      <PaginationButtonsV2 v-if="withPagination" :pagination="pagination" />
    </div>
  </FetchLoader>
</template>

<script setup lang="ts">
import { deleteNews } from '~/api/news.service'
import { getGroupNews } from '~/api/v2/group.service'
import FetchLoader from '~/components/base/FetchLoader.vue'
import EditNewsDrawer from '~/components/news/EditNewsDrawer/EditNewsDrawer.vue'
import NewsItem from '~/components/news/NewsItem.vue'
import { TranslatedPeopleGroupModel } from '~/models/invitation.model'
import { QueryFilterNews, TranslatedNews } from '~/models/news.model'
import { factoryPagination, maxSkeleton } from '~/skeletons/base.skeletons'
import { newsSkeleton } from '~/skeletons/news.skeletons'
import useToasterStore from '~/stores/useToaster'

const props = withDefaults(
  defineProps<{
    group: TranslatedPeopleGroupModel
    limit?: number
    withPagination?: boolean
    editable?: boolean
  }>(),
  {
    withPagination: true,
    limit: null,
    editable: false,
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
  refreshNuxtData(`${organizationCode}::group::${groupId.value}`)
  refresh()
  onCancel()
}

const onCancel = () => {
  selectedNews.value = null
  closeModals('edit', 'delete')
}
</script>
