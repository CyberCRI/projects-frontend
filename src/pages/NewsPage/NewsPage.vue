<script setup>
import { getNews, getAllNews, deleteNews } from '@/api/news.service.ts'
import useToasterStore from '@/stores/useToaster.ts'
import useOrganizationsStore from '@/stores/useOrganizations.ts'

const props = defineProps({
  slugOrId: {
    type: String,
    required: true,
  },
})

const { d, t } = useI18n()
const toaster = useToasterStore()
const organizationsStore = useOrganizationsStore()
const router = useRouter()
const route = useRoute()
const { canEditNews, canDeleteNews } = usePermissions()

const news = useState(() => null)
const otherNews = useState(() => [])
const loading = ref(false)
const editedNews = ref(null)
const newsToDelete = ref(null)
const isDeletingNews = ref(false)

const breadcrumbs = computed(() => {
  return [
    {
      name: 'News',
      route: { name: 'NewsListPage' },
    },
  ]
})

const publicationDate = computed(() => {
  return news.value?.publication_date ? d(new Date(news.value.publication_date)) : ''
})

const loadNews = async () => {
  try {
    news.value = await getNews(organizationsStore.current?.code, props.slugOrId)
  } catch (err) {
    console.error(err)
    router.replace({
      name: 'page404',
      params: { pathMatch: route.path.substring(1).split('/') },
    })
  }
}

const loadOtherNews = async () => {
  // fetch 3 news because we want to show 2 other news and one might be the current one
  otherNews.value = (await getAllNews(organizationsStore.current?.code, { limit: 3 })).results
    ?.filter((oNews) => !news.value || oNews.id !== news.value.id)
    .slice(0, 2)
}

const load = async () => {
  loading.value = true
  await loadNews()
  await loadOtherNews()
  loading.value = false
}

const doDeleteNews = async () => {
  isDeletingNews.value = true
  try {
    await deleteNews(organizationsStore.current?.code, newsToDelete.value.id)
    toaster.pushSuccess(t('news.delete.success'))
  } catch (err) {
    toaster.pushError(`${t('news.delete.error')} (${err})`)
    console.error(err)
  } finally {
    if (newsToDelete.value.id != news.value.id) {
      loadOtherNews()
      newsToDelete.value = null
      isDeletingNews.value = false
    } else {
      router.push({ name: 'NewsListPage' })
    }
  }
}
const onNewsEdited = (editedNews) => {
  if (editedNews.id === news.value.id) {
    loadNews()
  } else {
    loadOtherNews()
  }
}

watchEffect(() => [props.slugOrId], load)

onMounted(async () => {
  await load()
})

try {
  const runtimeConfig = useRuntimeConfig()
  const news = await getNews(runtimeConfig.public.appApiOrgCode, props.slugOrId, true)
  const { image, dimensions } = useImageAndDimension(news?.header_image, 'medium')

  useLpiHead(
    useRequestURL().toString(),
    news?.title,
    news?.content
      ?.replace(/<[^>]+>/gi, ' ')
      .replace(/\s+/gi, ' ')
      .substring(0, 300),
    image,
    dimensions
  )
} catch (err) {
  // DGAF
  console.log(err)
}
</script>
<template>
  <div class="news-list-page page-section-medium">
    <div class="news-header">
      <div class="news-img-ctn">
        <SkeletonComponent v-if="loading" width="100%" height="100%" />
        <CroppedApiImage
          v-else-if="news"
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
        <SkeletonComponent v-if="loading" class="skeleton-block" height="42px" tag="h1" />
        <h1 v-else-if="news" class="page-title">
          {{ news.title }}
        </h1>
        <SkeletonComponent v-if="loading" class="skeleton-block" height="16px" tag="p" />
        <p v-else-if="news">
          {{ publicationDate }}
        </p>
      </div>
      <div v-if="canEditNews || canDeleteNews" class="news-actions">
        <ContextActionButton
          v-if="canEditNews"
          action-icon="Pen"
          class="edit-btn small"
          @click="editedNews = news"
        />
        <ContextActionButton
          v-if="canDeleteNews"
          action-icon="Close"
          class="remove-btn small"
          @click="newsToDelete = news"
        />
      </div>
    </div>
  </div>

  <div class="page-section-narrow">
    <div v-if="loading">
      <SkeletonComponent class="skeleton-block" height="16px" tag="p" />
      <SkeletonComponent class="skeleton-block" height="16px" tag="p" />
      <SkeletonComponent class="skeleton-block" height="16px" tag="p" />
    </div>
    <TipTapOutput v-else-if="news" class="news-content" :content="news.content" />
  </div>

  <div class="other-news page-section-narrow">
    <h3 v-if="loading || otherNews.length" class="other-news-title">
      {{ $t('news.page.others') }}
    </h3>

    <NewsListItemSkeleton v-if="loading" />
    <template v-else>
      <NewsListItem
        v-for="anotherNews in otherNews"
        :key="anotherNews.id"
        :news="anotherNews"
        @edit-news="editedNews = anotherNews"
        @delete-news="newsToDelete = anotherNews"
      />
    </template>
  </div>

  <EditNewsDrawer
    :is-opened="!!editedNews"
    :news="editedNews"
    @news-edited="onNewsEdited"
    @close="editedNews = null"
  />

  <ConfirmModal
    v-if="newsToDelete"
    :content="$t('news.delete.message')"
    :title="$t('news.delete.title')"
    :asyncing="isDeletingNews"
    @cancel="newsToDelete = null"
    @confirm="doDeleteNews"
  />
</template>
<style lang="scss" scoped>
.news-header {
  margin-top: 70px;
  margin-bottom: 3rem;

  --news-dimension: 16rem;
  --picture-ratio: calc(4 / 3);

  display: flex;
  gap: 2rem;
  height: var(--news-dimension);
  overflow: hidden;
  padding: 1rem;
  border: $border-width-s solid $lighter-gray;
  border-radius: 1rem;
}

.news-img-ctn {
  flex-basis: calc(var(--picture-ratio, 1) * var(--news-dimension));
  height: var(--news-dimension);
  flex-shrink: 0;
}

.header-texts {
  flex-grow: 1;
}

.news-actions {
  display: flex;
  gap: $space-s;
  height: min-content;
}

.news-texts {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 1rem;
}

.page-title {
  font-size: $font-size-3xl;
  text-align: left;
}

.other-news {
  .other-news-title {
    font-size: $font-size-xl;
    margin-bottom: 2rem;
    text-align: center;
  }

  display: flex;
  flex-flow: column;
  gap: 1rem;
  margin: 4rem auto;
}

.cropped-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 1rem;
}

.skeleton-block {
  margin-bottom: 1rem;
}
</style>
