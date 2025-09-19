<template>
  <NewsListSkeleton v-if="isLoading" :limit="5" />
  <div v-else>
    <div class="home-news-container">
      <NewsFeed :newsfeed="newsfeed" @reload-newsfeed="loadNewsfeed" />
    </div>
    <div class="see-all">
      <LpiButton :label="$t('feed.see-all')" :secondary="false" @click="seeAll" />
    </div>
  </div>
</template>

<script>
import NewsFeed from '@/components/app/NewsFeed.vue'
import LpiButton from '@/components/base/button/LpiButton.vue'
import NewsListSkeleton from '@/components/news/NewsListSkeleton.vue'
import { getNewsfeed } from '@/api/newsfeed.service.ts'
import useOrganizationsStore from '@/stores/useOrganizations.ts'
export default {
  name: 'HomeNewsfeed',

  components: { NewsFeed, LpiButton, NewsListSkeleton },
  props: {
    limit: {
      type: Number,
      default: 6,
    },
  },
  setup() {
    const organizationsStore = useOrganizationsStore()
    const { translateNewsfeed } = useAutoTranslate()
    const isLoading = ref(true)
    const _newsfeed = ref([])
    const newsfeed = translateNewsfeed(_newsfeed)

    return {
      organizationsStore,
      isLoading,
      _newsfeed,
      newsfeed,
    }
  },

  computed: {
    organization() {
      return this.organizationsStore.current
    },
  },

  async mounted() {
    await this.loadNewsfeed()
  },

  methods: {
    async loadNewsfeed() {
      this.isLoading = true
      this._newsfeed = (
        await getNewsfeed(this.organization.code, {
          limit: this.limit,
        })
      ).results
      this.isLoading = false
    },

    seeAll() {
      this.$router.push({ name: 'Newsfeed' })
    },
  },
}
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
