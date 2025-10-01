<template>
  <div v-if="!load" class="profile-publications-container">
    <div class="profile-info-container">
      <div class="public-year-container">
        <h5>{{ t('profile.research-output-year') }}</h5>
        <div class="public-year-info">
          <span>{{ yearsInfo.minYear }}</span>
          <div class="publi-year">
            <span
              v-for="obj in yearsInfo.bar"
              :key="obj.year"
              :title="`${obj.year} (${obj.count})`"
              class="publi-year-bar"
              :style="{ '--bar-count': obj.height }"
            />
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
        {{
          publi.publication_date?.toLocaleDateString(undefined, { year: 'numeric', month: 'long' })
        }}
      </p>
      <div class="public-tags">
        <BadgeItem
          v-for="tag in publi.tags || []"
          :key="tag.name"
          :label="tag.name"
          :icon-name="iconName(tag.perc)"
        />
      </div>
      <div class="public-tags">
        <a
          v-for="source in publi.sources"
          :key="source.identifier.id"
          :href="harvesterToUrl(source.identifier)"
          target="_blank"
          rel="referer,noopener"
        >
          <BadgeItem
            :label="source.identifier.harvester"
            :icon-name="iconNameIdentifier(source.identifier.harvester)"
          />
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
  <div v-else>loading...</div>
</template>

<script setup>
import BadgeItem from '@/components/base/BadgeItem.vue'
import PaginationButtons from '@/components/base/navigation/PaginationButtons.vue'
import {
  sanitizeResearcherDocument,
  sanitizeResearcherDocumentAnalytics,
} from '@/api/sanitizes/researcher'

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

const { t } = useNuxtI18n()
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
// ensure docuements is loaded
const load = computed(() => loading.value === true || documents.value === null)

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

const getDocumentsInfo = () => {
  useAPI(
    `crisalid/researcher/${props.user.researcher.id}/documents?analytics=info&limit=${props.preview ? 5 : 15}`
  )
    .then(sanitizeResearcherDocumentAnalytics)
    .then((data) => {
      documentsAnalytics.value = data
    })
}

onMounted(() => {
  refresh(
    `crisalid/researcher/${props.user.researcher.id}/documents?offset=0&limit=${props.limit || 10}`
  )
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

  console.log(info)

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

const iconNameIdentifier = (harvester) => {}

const harvesterToUrl = (identifier) => {
  return `https://hal.science/${identifier.value.replace('hal-', '')}v1`
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
  }
}
.public-year {
  display: flex;
  justify-content: end;
  gap: 2rem;
}
.publi-year-bar {
  margin: 0 1px;
  --max-bar-height: 40;
  width: 10px;
  display: inline-block;
  background-color: #501087;
  height: calc(var(--max-bar-height) * (var(--bar-count) / 100) * 1px);
  transition: transform 0.4s;
  transform-origin: bottom;
  &:hover {
    transform: scale(120%);
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

.m-auto {
  margin: auto;
}
</style>
