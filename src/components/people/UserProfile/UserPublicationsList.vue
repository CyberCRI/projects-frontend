<template>
  <div v-if="documents" class="profile-publications-container">
    <div class="profile-info-container">
      <div class="public-year-container">
        <h5>
          {{ t('profile.research-output-year') }}
          {{ yearSelected ? `${yearSelected} (${documents.count})` : '' }}
        </h5>
        <div class="public-year-info">
          <span>{{ yearsInfo.minYear }}</span>
          <div class="publi-year">
            <component
              :is="preview ? 'button' : 'div'"
              v-for="obj in yearsInfo.bar"
              :key="obj.year"
              class="publi-year-bar"
              :class="{
                disabled: yearSelected !== null && yearSelected !== obj.year,
                selected: yearSelected === obj.year,
                preview: preview,
              }"
              :title="`${t('common.select')} ${obj.year} ${t('common.year')}`"
              :style="{ '--bar-count': obj.height }"
              @click="onSelectedYear(obj.year)"
            >
              <span>{{ obj.year }}</span>
            </component>
          </div>
          <span>{{ yearsInfo.maxYear }}</span>
        </div>
      </div>
      <div class="public-numbers-container">
        <div v-for="obj in documentsAnalytics.document_type" :key="obj.name" class="publi-numbers">
          <span>{{ obj.count }}</span>
          <span>{{ obj.name ?? t('common.other') }}</span>
        </div>
      </div>
    </div>
    <article v-for="publi in documents.results" :key="publi.id" class="profile-publications">
      <h2>{{ publi.title }}</h2>
      <div>
        <span v-for="(author, idx) in publi.authors" :key="author.id">
          <NuxtLink
            v-if="author.user?.slug"
            class="profile-publication-contributor"
            :to="{ name: 'ProfileOtherUser', params: { userId: author.user.slug } }"
          >
            <strong>{{ author.display_name }}</strong>
          </NuxtLink>
          <strong v-else class="profile-publication-contributor">{{ author.display_name }}</strong>
          <!-- add comas if users is upper than 2, and add "and" beetwen last contributors -->
          <span v-if="idx + 2 < publi.authors.length">,</span>
          <span v-else-if="idx + 2 === publi.authors.length">
            {{ ` ${$t('common.and')} ` }}
          </span>
        </span>
      </div>
      <p class="profile-publication-description">
        {{ publi.publication_date?.toLocaleDateString(locale, { year: 'numeric', month: 'long' }) }}
      </p>
      <div class="public-tags">
        <BadgeItem
          v-for="tag in publi.tags || []"
          :key="tag.name"
          :label="tag.name"
          :icon-name="iconName(tag.perc)"
        />
      </div>
      <div class="public-sources-container">
        <a
          v-for="source in publi.sources"
          :key="source.identifier.id"
          :href="harvesterToUrl(source.identifier)"
          :title="`${t('common.link-to')} ${source.identifier.harvester}`"
          target="_blank"
          rel="referer,noopener"
          class="public-sources"
        >
          <IconHarvester :harvester="source.identifier.harvester" height="1.3rem" />
        </a>
      </div>
    </article>
    <PaginationButtons
      v-if="props.preview === false"
      class="m-auto"
      :current="pagination.currentPage"
      :pagination="pagination"
      :total="pagination.total"
      @update-pagination="refresh"
    />
  </div>
  <div v-else-if="loading">loading...</div>
  <div v-else>
    {{ t('you.no-publications') }}
  </div>
</template>

<script setup>
import IconHarvester from '@/components/base/media/IconHarvester.vue'
import BadgeItem from '@/components/base/BadgeItem.vue'
import PaginationButtons from '@/components/base/navigation/PaginationButtons.vue'
import {
  sanitizeResearcherDocument,
  sanitizeResearcherDocumentAnalytics,
} from '@/api/sanitizes/researcher'
import { harvesterToUrl } from '@/functs/researcher.ts'

defineOptions({
  name: 'UserPublicationsList',
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
  document_type: [],
  years: [],
})

// for filters year
const yearSelected = ref(null)
const onSelectedYear = (year) => {
  // block select date in preview (from snapshot page)
  if (props.preview) {
    return
  }
  // if the selected year is the same, reset filters
  yearSelected.value = yearSelected.value === year ? null : year
}

const defaultURL = `crisalid/researcher/${props.user.researcher.id}/documents?offset=0&limit=${props.limit || 10}`

const refresh = (url) => {
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

watch(yearSelected, () => {
  const publicationDate = yearSelected.value ? `&publication_date__year=${yearSelected.value}` : ''
  refresh(`${defaultURL}${publicationDate}`)
  getDocumentsInfo()
})

const getDocumentsInfo = () => {
  const limit = props.preview ? `&limit=5` : ''
  const publicationDate = yearSelected.value ? `&publication_date__year=${yearSelected.value}` : ''

  useAPI(
    `crisalid/researcher/${props.user.researcher.id}/documents?analytics=info${limit}${publicationDate}`
  )
    .then(sanitizeResearcherDocumentAnalytics)
    .then((data) => {
      documentsAnalytics.value = data
    })
}

onMounted(() => {
  refresh(defaultURL)
  getDocumentsInfo()
})

// this create graph
const yearsInfo = computed(() => {
  const info = {
    minYear: null,
    maxYear: null,
    bar: [],
  }
  documentsAnalytics.value.years.forEach((o) => {
    if (info.minYear == null || info.minYear > o.year) {
      info.minYear = o.year
    }
    if (info.maxYear == null || info.maxYear < o.year) {
      info.maxYear = o.year
    }
    info.bar.push({
      count: o.total,
      year: o.year,
    })
  })

  const maxCount = Math.max(...info.bar.map((el) => el.count))
  info.bar.forEach((obj) => {
    obj.height = (obj.count / maxCount) * 100
  })

  return info
})

const iconName = (perc) => {
  // in progress icon, start from 1 to 8
  // so we calculate the percentage of icon
  const calc = Math.round(perc / (100 / 8))
  const progressValue = Math.max(Math.min(calc, 8), 1)

  return `progress-${progressValue}`
}
</script>

<style lang="scss" scoped>
$profile-publications: 1rem;
.profile-publications-container {
  display: flex;
  flex-direction: column;
  justify-items: start;
  gap: $profile-publications;

  & > *:not(:last-child)::after {
    content: '';
    display: inline-block;
    width: 100%;
    height: 2px;
    opacity: 0.7;
    background-color: #d4d4d4;
    transform: translateY(calc($profile-publications / 2));
  }
}

.profile-publications {
  border-radius: 5px;
  padding: 0.2rem;
  transition: background-color 0.25s ease;
}

.profile-publication-contributor {
  font-weight: bold;
  font-size: 0.9rem;
}
// if is a link, add correct color and underline
a.profile-publication-contributor {
  color: $primary-dark;
  text-decoration: underline;
}

.profile-publication-description {
  font-weight: 400;
  opacity: 0.75;
}

.profile-info-container {
  display: grid;
  grid-template-columns: 50% 50%;
}

@media screen and (max-width: 1000px) {
  .profile-info-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  .public-year-container > h5 {
    text-align: center;
  }
}

.public-year-container {
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
.public-year {
  display: flex;
  justify-content: end;
  gap: 2rem;
}
.publi-year-bar {
  border: none;
  margin: 0 1px;
  --max-bar-height: 60;
  --min-bar-height: 5;
  width: 10px;
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
    &:hover {
      transform: scale(120%);
    }
    &.disabled {
      opacity: 0.5;
    }
    &.selected {
      width: 4rem;
      min-height: 1.5rem;
      display: inline-flex;
      & > span {
        display: table;
        color: white;
        font-weight: bold;
        text-align: center;
        margin: auto;
      }
    }
  }
}
.public-year-info {
  display: flex;
  width: 100%;
  gap: 1rem;
  align-items: baseline;
}

.public-numbers-container {
  display: inline-flex;
  justify-content: end;
  gap: 2rem;
}
.publi-numbers {
  display: flex;
  flex-direction: column;
  text-align: center;
  justify-content: end;

  & :first-child {
    color: #501087;
    font-size: 2rem;
  }
  & :last-child {
    opacity: 0.6;
  }
}

.public-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.2rem;
  margin-top: 0.5rem;
}

.public-sources-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.2rem;
  margin-top: 0.5rem;
}
.public-sources {
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
</style>
