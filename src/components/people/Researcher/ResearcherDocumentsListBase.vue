<template>
  <div v-if="documents?.length" class="profile-documents-container">
    <div class="profile-info-container" :class="{ preview: preview }">
      <div class="doc-year-container">
        <h5>
          {{ t('profile.research-output-year') }}
          {{ query.year ? `${query.year} (${paginationCount})` : '' }}
        </h5>
        <div v-if="yearsInfo" class="doc-year-info">
          <span class="doc-year-info-minyear">{{ yearsInfo.minYear }}</span>
          <div>
            <component
              :is="preview ? 'button' : 'div'"
              v-for="obj in yearsInfo.bar"
              :key="obj.year"
              class="doc-year-bar"
              :class="{
                disabled: query.year && query.year !== obj.year,
                selected: query.year === obj.year,
                preview: preview,
              }"
              :title="`${t(`profile.${docType}`)} ${obj.year} (${obj.count})`"
              :style="{ '--bar-count': obj.height }"
              @click="!preview && toggleQuery('year', obj.year)"
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
          v-for="[name, count] in documentTypeInfos"
          :key="name"
          class="doc-numbers"
          :class="{
            disabled: query.document_type !== undefined && query.document_type !== (name ?? ''),
            selected: query.document_type === (name ?? ''),
            preview: preview,
          }"
          @click="!preview && toggleQuery('document_type', name ?? '')"
        >
          <span>{{ count }}</span>
          <span>
            {{
              (name && t(`researcher.document_types.${sanitizeTranslateKeys(name)}`)) ??
              t('common.other')
            }}
          </span>
        </component>
      </div>
      <div v-if="!preview && documentsRoleInfos.length" class="doc-roles-container">
        <!-- change button to div only if we are in preview (from summary page) -->
        <button
          v-for="[role, count] in documentsRoleInfos"
          :key="role"
          class="doc-roles"
          @click="toggleQuery('roles', role)"
        >
          <BadgeItem
            :class="{
              disabled: query.roles !== null && query.roles !== role,
              selected: query.roles === role,
              preview: preview,
            }"
            :label="`${t(`researcher.relators.${sanitizeTranslateKeys(role)}`)} ${count}`"
          />
        </button>
      </div>
      <div v-if="!preview" class="doc-roles-container">
        <!-- change button to div only if we are in preview (from summary page) -->
        <button
          class="doc-roles"
          @click="
            setQuery(
              'ordering',
              query.ordering === SORTING_DEFAULT ? 'publication_date' : '-publication_date'
            )
          "
        >
          <BadgeItem
            :label="SORTING_RESULTS[query.ordering]"
            :icon-name="query.ordering === SORTING_DEFAULT ? 'SortDesc' : 'SortAsc'"
          />
        </button>
      </div>
    </div>
    <div class="documents-list">
      <ResearcherDocument
        v-for="doc in documents"
        :key="doc.id"
        :document="doc"
        :doc-type="docType"
        :preview="preview"
        @similar="documentSelected = doc"
      />
    </div>
    <PaginationButtons2 v-if="props.preview === false" class="m-auto" :pagination="pagination" />
  </div>
  <div v-else class="documents-empty">
    {{ t(`profile.${docType}-empty`) }}
  </div>
  <ResearcherDocumentSimilars
    :document="documentSelected"
    :doc-type="docType"
    @close="documentSelected = null"
  />
</template>

<script setup lang="ts">
import {
  sanitizeTranslateKeys,
  sanitizeResearcherDocumentAnalyticsYears,
} from '@/api/sanitizes/researcher'
import ResearcherDocument from '@/components/people/Researcher/ResearcherDocument.vue'
import ResearcherDocumentSimilars from '@/components/people/Researcher/ResearcherDocumentSimilars.vue'
import { Pagination } from '@/composables/usePagination'
import { useQuery } from '@/composables/useQuery'
import {
  QueryFilterDocument,
  ResearcherDocumentAnalytics,
  TranslatedDocument,
} from '@/interfaces/researcher'

const props = withDefaults(
  defineProps<{
    documents: TranslatedDocument[]
    documentsAnalytics: ResearcherDocumentAnalytics
    pagination?: Pagination
    preview?: boolean
    docType: string
  }>(),
  { preview: false, pagination: null }
)
const { t } = useNuxtI18n()

const { count: paginationCount } = props.pagination

// when we click to "show similars documents"
const documentSelected = ref<TranslatedDocument>()

const SORTING_RESULTS = {
  publication_date: $t('common.order-asc'),
  '-publication_date': $t('common.order-desc'),
}
const SORTING_DEFAULT = '-publication_date'
// filter backend query
const { query, toggleQuery, setQuery } = useQuery<QueryFilterDocument>({
  ordering: SORTING_DEFAULT,
})

const emit = defineEmits<{
  onFilter: [QueryFilterDocument]
}>()

watch(query, (n) => {
  void n
  emit('onFilter', toRaw(n))
})

// this create years graph
const yearsInfo = computed(() => {
  if (!props.documentsAnalytics) {
    return null
  }
  return sanitizeResearcherDocumentAnalyticsYears(
    props.documentsAnalytics.years,
    props.preview ? 5 : null
  )
})

// convert object key/number to array sorted by DESC and sliced from preview limit
const sortInfos = (
  data: ResearcherDocumentAnalytics['document_types'] | ResearcherDocumentAnalytics['roles']
) => {
  const dataEntries = Object.entries(data ?? {})
    .toSorted(([, lenA], [, lenB]) => lenA - lenB)
    .reverse()
  if (props.pagination.limit.value) {
    return dataEntries.slice(0, props.pagination.limit.value)
  }
  return dataEntries
}

const documentTypeInfos = computed(() => sortInfos(props.documentsAnalytics?.document_types))
const documentsRoleInfos = computed(() => sortInfos(props.documentsAnalytics?.roles))
</script>

<style lang="scss" scoped>
$profile-documents: 1rem;

.profile-documents-container {
  display: flex;
  flex-direction: column;
  justify-items: start;
  gap: $profile-documents;
}

.documents-list > *:not(:last-child)::after {
  content: '';
  display: inline-block;
  width: 100%;
  height: 1.5px;
  opacity: 0.7;
  background-color: #d4d4d4;
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

@media screen and (width <=pxToRem(1000px)) {
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
  background-color: $primary-dark;
  height: calc((var(--max-bar-height) * (var(--bar-count) / 100) + var(--min-bar-height)) * 1px);
  transition: all 0.4s;
  transform-origin: bottom;
  border-radius: 20px;

  & > span {
    display: none;
  }

  &:not(.preview) {
    cursor: pointer;
    transform: translateZ(0);

    &:hover:not(.selected) {
      transform: translateZ(0) scale(120%);
    }

    &.selected:hover {
      transform: translateZ(0) scale(105%);
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
  border-radius: 12px;
  border: none;
  padding: 0.2rem 0.5rem;
  transition: all 0.2s;

  &:not(.preview) {
    cursor: pointer;

    &:hover,
    &.selected {
      background-color: $primary-dark;
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
    color: $primary-dark;
    font-size: 2rem;
  }

  & :last-child {
    opacity: 0.6;
    text-transform: capitalize;
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
