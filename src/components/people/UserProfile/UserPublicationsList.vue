<template>
  <div v-if="publications" class="profile-publications-container">
    <div class="profile-info-container" :class="{ preview: preview }">
      <div class="public-year-container">
        <h5>
          {{ t('profile.research-output-year') }}
          {{ filters.year ? `${filters.year} (${publications.count})` : '' }}
        </h5>
        <div class="public-year-info">
          <span class="public-year-info-minyear">{{ yearsInfo.minYear }}</span>
          <div class="publi-year">
            <component
              :is="preview ? 'button' : 'div'"
              v-for="obj in yearsInfo.bar"
              :key="obj.year"
              class="publi-year-bar"
              :class="{
                disabled: filters.year && filters.year !== obj.year,
                selected: filters.year === obj.year,
                preview: preview,
              }"
              :title="`${t('profile.publications')} ${obj.year} (${obj.count})`"
              :style="{ '--bar-count': obj.height }"
              @click="onFilter('year', obj.year)"
            >
              <span>{{ obj.year }}</span>
            </component>
          </div>
          <span class="public-year-info-maxyear">{{ yearsInfo.maxYear }}</span>
        </div>
      </div>
      <div class="public-numbers-container">
        <component
          :is="preview ? 'div' : 'button'"
          v-for="obj in publicationsTypeInfos"
          :key="obj.name"
          class="publi-numbers"
          :class="{
            disabled:
              filters.publication_type !== undefined &&
              filters.publication_type !== (obj.name ?? ''),
            selected: filters.publication_type === (obj.name ?? ''),
            preview: preview,
          }"
          @click="onFilter('publication_type', obj.name ?? '')"
        >
          <span>{{ obj.count }}</span>
          <span>{{ obj.name ?? t('common.other') }}</span>
        </component>
      </div>
      <div v-if="!preview" class="public-roles-container">
        <component
          :is="preview ? 'div' : 'button'"
          v-for="[role, count] in publicationsRoleInfos"
          :key="role"
          class="publi-roles"
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
    <article v-for="publi in publications.results" :key="publi.id" class="profile-publications">
      <h2>{{ publi.title }}</h2>
      <div>
        <span v-for="(author, idx) in publi.contributors" :key="author.id">
          <NuxtLink
            v-if="author.user?.slug"
            class="profile-publication-contributor"
            :to="{ name: 'ProfileOtherUser', params: { userId: author.user.slug } }"
          >
            <strong>{{ author.display_name }}</strong>
          </NuxtLink>
          <a
            v-else-if="researcherHarvesterToUrl(author)"
            :href="researcherHarvesterToUrl(author)"
            rel="noreferer,noopener"
            target="_blank"
            class="profile-publication-contributor"
          >
            {{ author.display_name }}
          </a>
          <span v-else class="profile-publication-contributor">
            {{ author.display_name }}
          </span>
          <!-- add comas if users is upper than 2, and add "and" beetwen last contributors -->
          <span v-if="idx + 2 < publi.contributors.length">,</span>
          <span v-else-if="idx + 2 === publi.contributors.length">
            {{ ` ${$t('common.and')} ` }}
          </span>
        </span>
      </div>
      <p class="profile-publication-description" :class="{ preview: preview }">
        {{ publi.description }}
      </p>
      <span>
        {{ publi.publication_date?.toLocaleDateString(locale, { year: 'numeric', month: 'long' }) }}
      </span>
      <div class="public-sources-container">
        <a
          v-for="identifier in publi.identifiers"
          :key="identifier.id"
          :href="publicationHarvesterToUrl(identifier)"
          :title="`${t('common.link-to')} ${identifier.harvester}`"
          target="_blank"
          rel="referer,noopener"
          class="public-sources"
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
      @update-pagination="getPublications"
    />
  </div>
  <div v-else-if="loading" class="publications-loading">{{ t('common.loading') }}...</div>
  <div v-else class="publications-empty">
    {{ t('you.no-publications') }}
  </div>
</template>

<script setup>
import IconHarvester from '@/components/base/media/IconHarvester.vue'
import PaginationButtons from '@/components/base/navigation/PaginationButtons.vue'
import { sanitizeResearcherPublication } from '@/api/sanitizes/researcher'
import { publicationHarvesterToUrl, researcherHarvesterToUrl } from '@/functs/researcher.ts'

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

const publications = ref(null)
const pagination = computed(() => {
  if (publications.value === null) {
    return { total: 0 }
  }
  return {
    currentPage: publications.value.current_page,
    total: publications.value.total_page,
    previous: publications.value.previous,
    next: publications.value.next,
    first: publications.value.first,
    last: publications.value.last,
  }
})
const loading = ref(false)
const publicationsAnalytics = ref({
  publication_types: [],
  years: [],
})

// filter backend query
// default role "author" to only show author publication
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

const getPublications = (url) => {
  loading.value = true
  useAPI(url)
    .then(sanitizeResearcherPublication)
    .then((data) => {
      publications.value = data
    })
    .finally(() => {
      loading.value = false
    })
}

const sanitizeFilters = () => {
  const publicationDate =
    filters.year !== undefined ? `&publication_date__year=${filters.year}` : ''
  const pubType =
    filters.publication_type !== undefined ? `&publication_type=${filters.publication_type}` : ''
  const roles = filters.roles !== undefined ? `&roles=${filters.roles}` : ''
  return `${publicationDate}${pubType}${roles}`
}

const defaultURL = `crisalid/researcher/${props.user.researcher.id}/publications?offset=0&limit=${props.limit || 10}`
watch(filters, () => {
  getPublications(`${defaultURL}${sanitizeFilters()}`)
  getPublicationsInfo()
})

const getPublicationsInfo = () => {
  const limit = props.preview ? `limit=5` : ''
  useAPI(
    `crisalid/researcher/${props.user.researcher.id}/publications/analytics?${limit}${sanitizeFilters()}`
  ).then((data) => {
    publicationsAnalytics.value = data
  })
}

// when components is mounted, getch
onMounted(() => {
  getPublications(`${defaultURL}${sanitizeFilters()}`)
  getPublicationsInfo()
})

// this create years graph
const yearsInfo = computed(() => {
  const info = {
    minYear: null,
    maxYear: null,
    bar: [],
  }
  publicationsAnalytics.value.years.forEach((o) => {
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

  info.bar = info.bar.reverse()

  return info
})

const publicationsTypeInfos = computed(() => {
  if (props.limit) {
    return publicationsAnalytics.value.publication_types.slice(0, props.limit)
  }
  return publicationsAnalytics.value.publication_types
})

const publicationsRoleInfos = computed(() => {
  const roles = Object.entries(publicationsAnalytics.value.roles)
    .sort(([, c]) => c)
    .reverse()
  if (props.limit) {
    return roles.slice(0, props.limit)
  }
  return roles
})
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
  padding-left: 0.2rem;
}

// if is a link, add correct color and underline
a.profile-publication-contributor {
  color: $primary-dark;
  text-decoration: underline;
}

span.profile-publication-contributor {
  font-style: italic;
  font-weight: normal;
}

.profile-publication-description {
  font-weight: 400;
  opacity: 0.75;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.profile-publication-description.preview {
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

  .public-year-container > h5 {
    text-align: center;
  }
}

@media screen and (width <= 1000px) {
  .profile-info-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;

    .public-year-container > h5 {
      text-align: center;
    }
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

.public-year-info-minyear {
  align-self: baseline;
}

.public-year-info-maxyear {
  align-self: flex-end;
}

.publi-year-bar {
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

.public-year-info {
  display: flex;
  width: 100%;
  gap: 1rem;
  align-items: baseline;
  font-weight: bold;
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

.publications-loading,
.publications-empty {
  width: 100%;
  text-align: center;
  opacity: 0.5;
  font-style: italic;
  font-weight: bold;
}

.publi-roles {
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
