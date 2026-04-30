<template>
  <article class="profile-documents">
    <span class="icon-container skeletons-text">
      <PushPinSvg />
      {{ t(`researcher.document_types.${document.document_type}`) }}
    </span>
    <h2 class="skeletons-text">{{ document.$t.title }}</h2>
    <div class="skeletons-text">
      <span v-for="(author, idx) in document.contributors" :key="author.id">
        <!-- if author.user isa projectsUser, create a nuxtlink to go to the user -->
        <NuxtLink
          v-if="author.user?.slug"
          class="profile-document-contributor"
          :to="{ name: 'ProfileOtherUser', params: { userId: author.user.slug } }"
        >
          <strong>{{ author.display_name }}</strong>
        </NuxtLink>
        <span v-else class="profile-document-contributor">
          {{ author.display_name }}
        </span>
        <!-- add comas if users is upper than 2, and add "and" beetwen last contributors -->
        <span v-if="idx + 2 < document.contributors.length">,</span>
        <span v-else-if="idx + 2 === document.contributors.length">
          {{ ` ${t('common.and')} ` }}
        </span>
      </span>
    </div>
    <p class="profile-document-description skeletons-text" :class="{ preview: preview }">
      {{ document.$t.description }}
    </p>
    <span v-if="document.publication_date" class="skeletons-text">
      {{
        new Date(document.publication_date).toLocaleDateString(locale, {
          year: 'numeric',
          month: 'long',
        })
      }}
    </span>
    <div class="doc-sources-container">
      <IdentifierLink
        v-for="identifier in document.identifiers"
        :key="identifier.id"
        :identifier="identifier"
        type="document"
      />
    </div>
    <SeeMoreArrow
      is="button"
      v-if="similar && document.similars > 0"
      :data-test="`see-more-${document.id}`"
      class="no-padding reset-btn"
      :label="`${document.similars} ${t(`profile.${docType}-similars`)}`"
      @click="emit('similar', document)"
    />
  </article>
</template>

<script setup lang="ts">
import type { TranslatedDocument } from '~/interfaces/researcher'

import IdentifierLink from '~/components/people/Researcher/IdentifierLink.vue'
import SeeMoreArrow from '~/components/base/button/SeeMoreArrow.vue'

import PushPinSvg from '~/assets/svg/pushpin.svg'

const { t, locale } = useNuxtI18n()
const emit = defineEmits(['similar'])

withDefaults(
  defineProps<{
    document: TranslatedDocument
    docType: string
    preview?: boolean
    similar?: boolean
  }>(),
  { similar: true, preview: false }
)
</script>

<style lang="scss" scoped>
.icon-container {
  display: flex;
  align-items: center;
  justify-content: start;
  gap: 0.4rem;
  font-weight: 700;
  color: $primary;
  text-transform: capitalize;
  letter-spacing: -0.1;
}

.profile-documents {
  border-radius: 5px;
  padding: 0.2rem;
  transition: background-color 0.25s ease;
}

.profile-document-contributor {
  font-weight: bold;
  font-size: 0.9rem;
  padding-left: 0.2rem;
}

// if is a link, add correct color and underline
a.profile-document-contributor {
  color: $primary-dark;
  text-decoration: underline;
}

span.profile-document-contributor {
  font-style: italic;
  font-weight: normal;
}

.profile-document-description {
  font-weight: 400;
  opacity: 0.75;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.profile-document-description.preview {
  -webkit-line-clamp: 2;
}

.doc-sources-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.2rem;
  margin-top: 0.5rem;
}

.no-padding {
  padding: 0 !important;
}
</style>
