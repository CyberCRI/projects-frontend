<template>
  <div v-if="documents" class="profile-documents-container">
    <div class="profile-info-container" :class="{ preview: preview }">
      <div class="doc-year-container">
        <h5>
          {{ t('profile.research-output-year') }}
          {{ filters.year ? `${filters.year} (${documents.count})` : '' }}
        </h5>
        <div class="doc-year-info">
          <span class="doc-year-info-minyear">{{ yearsInfo.minYear }}</span>
          <div>
            <component
              :is="preview ? 'button' : 'div'"
              v-for="obj in yearsInfo.bar"
              :key="obj.year"
              class="doc-year-bar"
              :class="{
                disabled: filters.year && filters.year !== obj.year,
                selected: filters.year === obj.year,
                preview: preview,
              }"
              :title="`${t('profile.documents')} ${obj.year} (${obj.count})`"
              :style="{ '--bar-count': obj.height }"
              @click="onFilter('year', obj.year)"
            >
              <span>{{ obj.year }}</span>
            </component>
          </div>
          <span class="doc-year-info-maxyear">{{ yearsInfo.maxYear }}</span>
        </div>
      </div>
      <div class="doc-numbers-container">
        <component
          :is="preview ? 'div' : 'button'"
          v-for="[name, count] in DocumentTypeInfos"
          :key="name"
          class="doc-numbers"
          :class="{
            disabled: filters.document_type !== undefined && filters.document_type !== (name ?? ''),
            selected: filters.document_type === (name ?? ''),
            preview: preview,
          }"
          @click="onFilter('document_type', name ?? '')"
        >
          <span>{{ count }}</span>
          <span>{{ name ?? t('common.other') }}</span>
        </component>
      </div>
      <div v-if="!preview && documentsRoleInfos.length" class="doc-roles-container">
        <component
          :is="preview ? 'div' : 'button'"
          v-for="[role, count] in documentsRoleInfos"
          :key="role"
          class="doc-roles"
          @click="onFilter('roles', role)"
        >
          <BadgeItem
            :class="{
              disabled: filters.roles !== null && filters.roles !== role,
              selected: filters.roles === role,
              preview: preview,
            }"
            :label="`${role} ${count}`"
          />
        </component>
      </div>
    </div>
    <article v-for="doc in documents.results" :key="doc.id" class="profile-documents">
      <h2>{{ doc.title }}</h2>
      <div>
        <span v-for="(author, idx) in doc.contributors" :key="author.id">
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
          <span v-if="idx + 2 < doc.contributors.length">,</span>
          <span v-else-if="idx + 2 === doc.contributors.length">
            {{ ` ${t('common.and')} ` }}
          </span>
        </span>
      </div>
      <p class="profile-document-description" :class="{ preview: preview }">
        {{ doc.description }}
      </p>
      <span>
        {{ doc.publication_date?.toLocaleDateString(locale, { year: 'numeric', month: 'long' }) }}
      </span>
      <div class="doc-sources-container">
        <a
          v-for="identifier in doc.identifiers"
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
    </article>
    <PaginationButtons
      v-if="props.preview === false"
      class="m-auto"
      :current="pagination.currentPage"
      :pagination="pagination"
      :total="pagination.total"
      @update-pagination="getDocuments"
    />
  </div>
  <div v-else-if="loading" class="documents-loading">{{ t('common.loading') }}...</div>
  <div v-else class="documents-empty">
    {{ t('you.no-documents') }}
  </div>
</template>

<script setup>
// TODO(remi): need to use useFetch to optimize request, and create paginated composable
import IconHarvester from '@/components/base/media/IconHarvester.vue'
import PaginationButtons from '@/components/base/navigation/PaginationButtons.vue'
import {
  sanitizeResearcherDocument,
  sanitizeResearcherDocumentAnalyticsYears,
} from '@/api/sanitizes/researcher'
import { documentTypeHarverToUrl, researcherHarvesterToUrl } from '@/functs/researcher.ts'

defineOptions({
  name: 'ResearcherDocumentsList',
})

const props = defineProps({
  preview: {
    type: Boolean,
    default: false,
  },
  limit: {
    type: Number,
    default: null,
  },
  user: {
    type: Object,
    required: true,
  },
  docType: {
    type: String,
    required: true,
  },
})
const { t, locale } = useNuxtI18n()

const documents = ref(null)
const pagination = computed(() => {
  if (documents.value === null) {
    return { total: 0 }
  }
  return {
    currentPage: documents.value.current_page,
    total: documents.value.total_page,
    previous: documents.value.previous,
    next: documents.value.next,
    first: documents.value.first,
    last: documents.value.last,
  }
})
const loading = ref(false)
const documentsAnalytics = ref({
  document_types: {},
  years: [],
})

// filter backend query
// default role "author" to only show author form documents
const filters = reactive({
  roles: 'author',
})
const onFilter = (key, value) => {
  if (props.preview) {
    return
  }
  if (filters[key] === value) {
    delete filters[key]
  } else {
    filters[key] = value
  }
}

const getDocuments = (url) => {
  loading.value = true
  useAPI(url)
    .then(sanitizeResearcherDocument)
    .then((data) => {
      documents.value = data
    })
    .finally(() => {
      loading.value = false
    })
}

const sanitizeFilters = () => {
  const publicationDate = filters.year !== undefined ? `&year=${filters.year}` : ''
  const pubType =
    filters.document_type !== undefined ? `&document_type=${filters.document_type}` : ''
  const roles = filters.roles !== undefined ? `&roles=${filters.roles}` : ''
  return `${publicationDate}${pubType}${roles}`
}

const defaultURL = `crisalid/researcher/${props.user.researcher.id}/${props.docType}/?offset=0&limit=${props.limit || 10}`
watch(filters, () => {
  getDocuments(`${defaultURL}${sanitizeFilters()}`)
  getDocumentsInfo()
})

const getDocumentsInfo = () => {
  const limit = props.preview ? `limit=5` : ''
  useAPI(
    `crisalid/researcher/${props.user.researcher.id}/${props.docType}/analytics/?${limit}${sanitizeFilters()}`
  ).then((data) => {
    documentsAnalytics.value = data
  })
}

// when components is mounted, getch
onMounted(() => {
  getDocuments(`${defaultURL}${sanitizeFilters()}`)
  getDocumentsInfo()
})

// this create years graph
const yearsInfo = computed(() =>
  sanitizeResearcherDocumentAnalyticsYears(documentsAnalytics.value.years)
)

const DocumentTypeInfos = computed(() => {
  const documentTypes = Object.entries(documentsAnalytics.value.document_types)
    .toSorted((a, b) => a[1] - b[1])
    .reverse()
  if (props.limit) {
    return documentTypes.slice(0, props.limit)
  }
  return documentTypes
})

const documentsRoleInfos = computed(() => {
  const roles = Object.entries(documentsAnalytics.value.roles)
    .sort(([, c]) => c)
    .reverse()
  if (props.limit) {
    return roles.slice(0, props.limit)
  }
  return roles
})
</script>

<style lang="scss" scoped>
$profile-documents: 1rem;

.profile-documents-container {
  display: flex;
  flex-direction: column;
  justify-items: start;
  gap: $profile-documents;

  & > *:not(:last-child)::after {
    content: '';
    display: inline-block;
    width: 100%;
    height: 2px;
    opacity: 0.7;
    background-color: #d4d4d4;
    transform: translateY(calc($profile-documents / 2));
  }
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

.profile-info-container {
  display: grid;
  grid-template-columns: 50% 50%;
  grid-template-rows: auto auto;
}

.profile-info-container:not(.preview) {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;

  .doc-year-container > h5 {
    text-align: center;
  }
}

@media screen and (width <= 1000px) {
  .profile-info-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;

    .doc-year-container > h5 {
      text-align: center;
    }
  }
}

.doc-year-container {
  display: inline-flex;
  justify-content: start;
  align-items: baseline;
  flex-direction: column;
  gap: 1rem;

  & > h5 {
    opacity: 0.7;
    font-size: 0.8rem;
    width: 100%;
  }
}

.doc-year {
  display: flex;
  justify-content: end;
  gap: 2rem;
}

.doc-year-info-minyear {
  align-self: baseline;
}

.doc-year-info-maxyear {
  align-self: flex-end;
}

.doc-year-bar {
  border: none;
  margin: 0 1px;

  --max-bar-height: 60;
  --min-bar-height: 5;

  width: 12.5px;
  display: inline-block;
  background-color: #501087;
  height: calc((var(--max-bar-height) * (var(--bar-count) / 100) + var(--min-bar-height)) * 1px);
  transition: all 0.4s;
  transform-origin: bottom;
  border-radius: 20px;

  & > span {
    display: none;
  }

  &:not(.preview) {
    cursor: pointer;

    &:hover:not(.selected) {
      transform: scale(120%);
    }

    &.selected:hover {
      transform: scale(105%);
    }

    &:not(:hover).disabled {
      opacity: 0.5;
    }

    &.selected {
      width: 4rem;
      min-height: 1.5rem;
      display: inline-flex;
      vertical-align: bottom;

      & > span {
        color: white;
        font-weight: bold;
        text-align: center;
        margin: auto;
        display: block;
      }
    }
  }
}

.doc-year-info {
  display: flex;
  width: 100%;
  gap: 1rem;
  align-items: baseline;
  font-weight: bold;
}

.doc-numbers-container {
  display: inline-flex;
  justify-content: end;
  gap: 2rem;
}

.doc-numbers {
  display: flex;
  flex-direction: column;
  text-align: center;
  justify-content: end;
  border-radius: 12px;
  border: none;
  padding: 0.2rem 0.5rem;
  transition: all 0.2s;

  &:not(.preview) {
    cursor: pointer;

    &:hover,
    &.selected {
      background-color: #501087;
      color: white;

      & :first-child {
        color: white;
      }
    }

    &.disabled {
      opacity: 0.6;
    }
  }

  & :first-child {
    color: #501087;
    font-size: 2rem;
  }

  & :last-child {
    opacity: 0.6;
    text-transform: capitalize;
  }
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

.m-auto {
  margin: auto;
}

.documents-loading,
.documents-empty {
  width: 100%;
  text-align: center;
  opacity: 0.5;
  font-style: italic;
  font-weight: bold;
}

.doc-roles {
  margin: 0;
  border: 0;
  background-color: unset;

  > :not(.preview) {
    cursor: pointer;

    &.disaled {
      opacity: 0.4;
    }
  }
}
</style>
