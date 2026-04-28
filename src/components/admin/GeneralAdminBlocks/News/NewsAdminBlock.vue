<template>
  <AdminBlock :block-title="blockTitle">
    <template #default>
      <FetchLoader :status="status">
        <div class="list-divider list-container">
          <NewsItem
            v-for="news in allNews"
            :key="news.id"
            :news="news"
            editable
            @edit="onEdit"
            @delete="onDelete"
          />
        </div>
      </FetchLoader>
    </template>

    <template #footer>
      <LpiButton btn-icon="Plus" :label="$t('common.add')" @click="addNews" />
      <LinkButton
        btn-icon="ArrowRight"
        :label="$t('common.see-all')"
        :to="{ name: 'NewsListPage' }"
      />
    </template>
  </AdminBlock>

  <EditNewsDrawer
    :is-opened="stateModals.edit"
    :news="selectedNews"
    @close="onCancel"
    @news-edited="refresh"
  />

  <ConfirmModal
    v-if="stateModals.delete"
    :title="$t('news.delete.title')"
    :asyncing="isDeletingNews"
    @cancel="onCancel"
    @confirm="onDeleteNews"
  >
    <NewsItem is="div" :news="selectedNews" />
  </ConfirmModal>
</template>

<script setup lang="ts">
import type { QueryFilterNews } from '~/models/news.model'

import { getAllNews } from '~/api/v2/news.service'
import { deleteNews } from '~/api/news.service'

import { defaultForm } from '~/components/instruction/InstructionForm/InstructionForm.vue'
import EditNewsDrawer from '~/components/news/EditNewsDrawer/EditNewsDrawer.vue'
import AdminBlock from '~/components/admin/GeneralAdminBlocks/AdminBlock.vue'
import ConfirmModal from '~/components/base/modal/ConfirmModal.vue'
import LinkButton from '~/components/base/button/LinkButton.vue'
import LpiButton from '~/components/base/button/LpiButton.vue'
import FetchLoader from '~/components/base/FetchLoader.vue'
import NewsItem from '~/components/news/NewsItem.vue'

import useToasterStore from '~/stores/useToaster'

import { useModals } from '~/composables/useModal'

import { nowDate } from '~/functs/date'

const toaster = useToasterStore()
const organizationCode = useOrganizationCode()

const { t } = useNuxtI18n()

const { stateModals, openModals, closeModals } = useModals({ edit: false, delete: false })
const isDeletingNews = ref(false)
const selectedNews = ref()

const { query } = useQuery<QueryFilterNews>({
  ordering: '-updated_at',
  from_date: nowDate().toISOString(),
})

const {
  status,
  data: allNews,
  pagination,
  refresh,
  isLoading,
} = getAllNews(organizationCode, {
  query,
  paginationConfig: {
    limit: 3,
  },
})

const blockTitle = computed(() => {
  const extra = isLoading.value ? '' : ` (${pagination.count.value})`
  return t('admin.portal.news') + extra
})

const addNews = () => {
  selectedNews.value = defaultForm()
  openModals('edit')
}

const onEdit = (news) => {
  selectedNews.value = news
  openModals('edit')
}
const onDelete = (news) => {
  selectedNews.value = news
  openModals('delete')
}

const onDeleteNews = async () => {
  isDeletingNews.value = true
  try {
    await deleteNews(organizationCode, selectedNews.value.id)
    toaster.pushSuccess(t('news.delete.success'))

    refresh()
  } catch (err) {
    toaster.pushError(`${t('news.delete.error')} (${err})`)
    console.error(err)
  } finally {
    isDeletingNews.value = false
    onCancel()
  }
}

const onCancel = () => {
  selectedNews.value = null
  closeModals('delete', 'edit')
}
</script>
