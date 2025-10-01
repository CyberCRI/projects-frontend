<template>
  <div class="publications-tab">
    <div>
      <h4 class="title">
        {{ title }}
        <span>({{ documents_count }})</span>
      </h4>
      <UserPublicationsList v-if="documents_count > 0" :limit="null" :user="user" />
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
const documents_count = props.user.researcher.documents_count
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
