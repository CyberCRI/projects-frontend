<template>
  <FetchLoader :status="status" only-error :error="error" error404 skeleton>
    <div class="news-container page-section-narrow">
      <div class="news-list-page page-section-medium">
        <div class="news-header">
          <div class="news-img-ctn">
            <CroppedApiImage
              :alt="`${news.title} image`"
              class="picture"
              :ratio="4 / 3"
              :picture-data="news.header_image"
              picture-size="medium"
              default-picture="/patatoids-project/Patatoid-1.png"
            />
          </div>
          <div class="header-texts">
            <BreadCrumbs :breadcrumbs="breadcrumbs" />
            <h1 class="page-title">
              {{ news.$t.title }}
            </h1>
            <p>
              {{ publicationDate }}
            </p>
          </div>
          <div v-if="canEditNews || canDeleteNews" class="news-actions">
            <ContextActionButton
              v-if="canEditNews"
              action-icon="Pen"
              class="edit-btn small"
              @click="openModals('edit')"
            />
            <ContextActionButton
              v-if="canDeleteNews"
              action-icon="Close"
              class="remove-btn small"
              @click="openModals('delete')"
            />
          </div>
        </div>
      </div>

      <TipTapOutput :content="news.$t.content" />

      <MapRecap v-if="news.location" class="map" :locations="[news.location]">
        <template #tooltip="{ location }">
          <LocationNewsTooltip :location="location" :news="news" />
        </template>
      </MapRecap>
    </div>

    <EditNewsDrawer
      :is-opened="stateModals.edit"
      :news="news"
      @news-edited="refresh"
      @close="onCancel"
    />

    <ConfirmModal
      v-if="stateModals.delete"
      :title="$t('news.delete.title')"
      :asyncing="asyncingDelete"
      @cancel="closeModals('delete')"
      @confirm="onConfirmDelete"
    >
      <NewsItem :news="news" />
    </ConfirmModal>
  </FetchLoader>
</template>

<script setup lang="ts">
import LocationNewsTooltip from '@/components/news/map/LocationNewsTooltip.vue'
import { getNews } from '@/api/v2/news.service'
import { newsSkeleton } from '@/skeletons/news.skeletons'
import { deleteNews } from '@/api/news.service'
import NewsItem from '@/components/news/NewsItem.vue'
import useToasterStore from '@/stores/useToaster'
import EditNewsDrawer from '@/components/news/EditNewsDrawer/EditNewsDrawer.vue'
import ConfirmModal from '@/components/base/modal/ConfirmModal.vue'
import { NewsModel } from '@/models/news.model'
import { html2Text } from '@/functs/string'
import CroppedApiImage from '@/components/base/media/CroppedApiImage.vue'
import BreadCrumbs from '@/components/base/navigation/BreadCrumbs.vue'

const props = defineProps<{
  slugOrId: string
}>()

const toaster = useToasterStore()

const { canEditNews, canDeleteNews } = usePermissions()

const { locale, t } = useNuxtI18n()

const organizationCode = useOrganizationCode()
const newsId = computed<NewsModel['id']>(() => parseInt(props.slugOrId, 10))
const {
  status,
  data: news,
  error,
  refresh,
} = getNews(organizationCode, newsId, {
  default: () => newsSkeleton(),
})

const asyncingDelete = ref(false)
const breadcrumbs = computed(() => [
  {
    name: t('home.news'),
    route: { name: 'NewsListPage' },
  },
])

const publicationDate = computed(() =>
  new Date(news.value.publication_date).toLocaleDateString(locale.value, { dateStyle: 'full' })
)

const { stateModals, openModals, closeModals } = useModals({ edit: false, delete: false })

const onConfirmDelete = async () => {
  asyncingDelete.value = true
  try {
    await deleteNews(organizationCode, news.value.id)
    toaster.pushSuccess(t('news.delete.success'))
    refresh()
  } catch (err) {
    toaster.pushError(`${t('news.delete.error')} (${err})`)
    console.error(err)
  } finally {
    asyncingDelete.value = false
    onCancel()
  }
}

const onCancel = () => closeModals('delete', 'edit')

useLpiHead2({
  title: computed(() => news.value?.$t.title),
  description: computed(() => html2Text(news.value?.$t.content)),
})
</script>

<style lang="scss" scoped>
.news-container {
  margin-bottom: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  flex-direction: column;
}

.map {
  width: 100%;
}

.news-header {
  --news-dimension: 16rem;
  --picture-ratio: calc(4 / 3);

  margin-top: 70px;
  margin-bottom: 3rem;
  display: flex;
  gap: 2rem;
  height: var(--news-dimension);
  overflow: hidden;
  border-radius: 1rem;
}

.news-actions {
  display: flex;
  gap: $space-s;
  height: min-content;
}

.news-img-ctn {
  display: flex;
  flex-basis: calc(var(--picture-ratio, 1) * var(--news-dimension));
  height: var(--news-dimension);
  flex-shrink: 0;
}

.picture {
  border-radius: $border-radius-m;
}

.page-title {
  font-size: $font-size-3xl;
  text-align: left;
}
</style>
