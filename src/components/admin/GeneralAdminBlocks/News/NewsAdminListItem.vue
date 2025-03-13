<template>
  <NuxtLink class="news-list-item" :to="{ name: 'NewsPage', params: { slugOrId: news.id } }">
    <div class="news-img-ctn">
      <CroppedApiImage
        :alt="`${news.title} image`"
        class="picture"
        :ratio="4 / 3"
        :picture-data="news?.header_image"
        picture-size="small"
        default-picture="/patatoids-project/Patatoid-1.png"
      />
    </div>
    <div class="news-texts">
      <div class="news-title-ctn">
        <h3 class="news-title">
          {{ news.title }}
        </h3>
        <ContextActionMenu
          class="news-actions"
          :can-edit="canEditNews"
          :can-delete="canDeleteNews"
          @edit="$emit('edit-news', news)"
          @delete="$emit('delete-news', news)"
        />
      </div>
    </div>
  </NuxtLink>
</template>
<script>
import CroppedApiImage from '@/components/base/media/CroppedApiImage.vue'
import ContextActionMenu from '@/components/base/button/ContextActionMenu.vue'
import permissions from '@/mixins/permissions.ts'

export default {
  name: 'NewsAdminListItem',

  components: {
    CroppedApiImage,
    ContextActionMenu,
  },

  mixins: [permissions],

  props: {
    news: {
      type: Object,
      required: true,
    },
  },

  emits: ['delete-news', 'edit-news'],

  computed: {
    canEditNews() {
      // TODO: implement logic
      return true
    },
  },
}
</script>
<style scoped lang="scss">
.news-list-item {
  --news-dimension: 3rem;
  --picture-ratio: calc(4 / 3);

  display: flex;
  gap: 1rem;
  height: var(--news-dimension);
  padding: 1rem 0;
  cursor: pointer;

  &:hover {
    background-color: $primary-lighter;
  }
}

.news-img-ctn {
  flex-basis: calc(var(--news-dimension) * var(--picture-ratio, 1));
  height: var(--news-dimension);
  flex-shrink: 0;
}

.news-texts {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 1rem;
}

.news-title-ctn {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.news-title {
  font-size: $font-size-xl;
}

.cropped-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 1rem;
}
</style>
