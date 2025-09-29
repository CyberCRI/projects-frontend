<template>
  <div class="publications-tab">
    <div>
      <h4 class="title">
        {{ title }}
        <span>({{ publications.length }})</span>
      </h4>
      <UserPublicationsList v-if="publications.length" :limit="null" :publications="publications" />
      <span v-else class="publications-tab-empty">
        {{ t('you.no-publications') }}
      </span>
    </div>
  </div>
</template>

<script setup>
import UserPublicationsList from '@/components/people/UserProfile/UserPublicationsList.vue'

defineOptions({
  name: 'ProfilePublicationsTab',
})

const { t } = useNuxtI18n()

const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
})

const title = t('me.publications')
const publications = props.user.publications
</script>

<style lang="scss" scoped>
.publications-tab {
  .title {
    font-size: $font-size-l;
    font-weight: 700;
    color: $primary-dark;
    margin: $space-l 0;
  }
}

.publications-tab-empty {
  font-style: italic;
  opacity: 0.7;
}
</style>
