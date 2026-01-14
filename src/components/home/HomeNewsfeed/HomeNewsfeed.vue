<template>
  <NewsListSkeleton v-if="isLoading" :limit="5" />
  <div v-else-if="transltedNewsFeed?.length">
    <div class="home-news-container">
      <NewsFeed :newsfeed="transltedNewsFeed" @reload-newsfeed="loadNewsfeed" />
    </div>
    <div v-if="hasMoreNews" class="see-all">
      <LpiButton :label="$t('feed.see-all')" :secondary="false" @click="seeAll" />
    </div>
  </div>
  <div v-else>
    <EmptyNewsFeed />
  </div>
</template>

<script setup lang="ts">
import NewsFeed from '@/components/app/NewsFeed.vue'
import LpiButton from '@/components/base/button/LpiButton.vue'
import NewsListSkeleton from '@/components/news/NewsListSkeleton.vue'
import { getNewsfeed } from '@/api/newsfeed.service'

const props = withDefaults(defineProps<{ limit?: number }>(), { limit: 6 })
const organizationCode = useOrganizationCode()
const { translateNewsfeed } = useAutoTranslate()
const isLoading = ref(true)
const newsfeed = ref([])
const transltedNewsFeed = translateNewsfeed(newsfeed)

const hasMoreNews = ref(false)

const router = useRouter()

const loadNewsfeed = async () => {
  isLoading.value = true
  newsfeed.value = (
    await getNewsfeed(organizationCode, {
      limit: props.limit,
    })
  ).results
  isLoading.value = false
}
const seeAll = () => router.push({ name: 'Newsfeed' })

onMounted(async () => {
  await loadNewsfeed()
})
</script>

<style lang="scss" scoped>
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: $space-xl;
  margin-bottom: $space-m;
}

.home-news-container {
  display: flex;
  flex-direction: column;
  place-content: center center;
  gap: $space-l;
}

.see-all {
  margin-top: $space-l;
  display: flex;
  justify-content: center;
}
</style>
