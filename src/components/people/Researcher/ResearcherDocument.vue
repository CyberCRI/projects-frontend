<template>
  <article class="profile-documents">
    <span class="icon-container">
      <PushPinSvg />
      {{ t(`researcher.document_types.${sanitizeTranslateKeys(document.document_type)}`) }}
    </span>
    <h2>{{ document.$t.title }}</h2>
    <div>
      <span v-for="(author, idx) in document.contributors" :key="author.id">
        <!-- if author.user isa projectsUser, create a nuxtlink to go to the user -->
        <NuxtLink
          v-if="author.user?.slug"
          class="profile-document-contributor"
          :to="{ name: 'ProfileOtherUser', params: { userId: author.user.slug } }"
        >
          <strong>{{ author.display_name }}</strong>
        </NuxtLink>
        <!-- else , ceate a link to the harvester (hal,idref..ect) -->
        <a
          v-else-if="researcherHarvesterToUrl(author)"
          :href="researcherHarvesterToUrl(author)"
          rel="noreferer,noopener"
          target="_blank"
          class="profile-document-contributor"
        >
          {{ author.display_name }}
        </a>
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
    <p class="profile-document-description" :class="{ preview: preview }">
      {{ document.$t.description }}
    </p>
    <span>
      {{
        new Date(document.publication_date).toLocaleDateString(locale, {
          year: 'numeric',
          month: 'long',
        })
      }}
    </span>
    <div class="doc-sources-container">
      <a
        v-for="identifier in document.identifiers"
        :key="identifier.id"
        :href="documentTypeHarverToUrl(docType, identifier)"
        :title="`${t('common.link-to')} ${identifier.harvester}`"
        target="_blank"
        rel="referer,noopener"
        class="doc-sources"
      >
        <IconHarvester :harvester="identifier.harvester" height="1.3rem" />
      </a>
    </div>
    <SeeMoreArrow
      v-if="similar && document.similars > 0"
      data-test="see-more"
      class="no-padding"
      :label="`${document.similars} ${t(`profile.${docType}-similars`)}`"
      @click.prevent="emit('similar', document)"
    />
  </article>
</template>

<script setup lang="ts">
import { documentTypeHarverToUrl, researcherHarvesterToUrl } from '@/functs/researcher'
import { TranslatedDocument } from '@/iterfaces/researcher'
import PushPinSvg from '@/assets/svg/pushpin.svg'
import { sanitizeTranslateKeys } from '@/api/sanitizes/researcher'

defineOptions({ name: 'ResearcherDocument' })

const { t } = useNuxtI18n()
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

.doc-sources {
  border: 1px gray;
  border-radius: 30px;
  padding: 0.2rem 0.4rem;
  transition: all 0.2s;
  background-color: $primary-light;

  &:hover {
    transform: scale(102%);
  }
}

.no-padding {
  padding: 0 !important;
}
</style>
