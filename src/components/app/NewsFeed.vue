<template>
  <div v-for="(item, index) in newsfeed" :key="index">
    <NewsfeedAnnouncementsItem
      v-if="item.type == 'announcement'"
      class="newsfeed-announcement"
      :announcement="item.announcement"
    />
    <NewsfeedProjectItem
      v-else-if="item.type == 'project'"
      class="newsfeed-project"
      :project="item.project"
    />
    <NewsItem v-else-if="item.type == 'news'" class="newsfeed-news" :news="item.news" />
  </div>
</template>
<script setup lang="ts">
import NewsfeedAnnouncementsItem from '~/components/home/HomeNewsfeed/NewsfeedAnnouncementsItem.vue'
import NewsfeedProjectItem from '~/components/home/HomeNewsfeed/NewsfeedProjectItem.vue'
import { TranslatedNewsfeed } from '~/models/newsfeed.model'
import NewsItem from '~/components/news/NewsItem.vue'

defineProps<{ newsfeed: TranslatedNewsfeed[] }>()
</script>
