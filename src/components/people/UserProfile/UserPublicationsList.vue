<template>
  <div class="profile-publications-container">
    <div class="profile-info-container">
      <div class="public-year-container">
        <h5>{{ t('profile.research-output-year') }}</h5>
        <div class="public-year-info">
          <span>{{ yearsInfo.minYear }}</span>
          <div class="publi-year">
            <span
              :title="`${obj.year} (${obj.count})`"
              v-for="obj in yearsInfo.bar"
              :key="obj.year"
              class="publi-year-bar"
              :style="{ '--bar-count': obj.height }"
            />
          </div>
          <span>{{ yearsInfo.maxYear }}</span>
        </div>
      </div>
      <div class="public-numbers-container">
        <div
          class="publi-numbers"
          v-for="[name, value] in Object.entries(publications.global)"
          :key="name"
        >
          <span>{{ value }}</span>
          <span>{{ name }}</span>
        </div>
      </div>
    </div>
    <NuxtLink
      :to="{ name: 'ProfilePublicationsOther', params: { publicationId: publi.id } }"
      v-for="publi in publicationsSliced"
      :key="publi.id"
    >
      <article class="profile-publications">
        <h2>{{ publi.title }}</h2>
        <div>
          <span
            v-for="(contributor, idx) in publi.contributors"
            :key="contributor.slug || contributor.name"
          >
            <NuxtLink
              class="profile-publication-contributor"
              v-if="contributor.slug"
              :to="{ name: 'ProfileOtherUser', params: { userId: contributor.slug } }"
            >
              <strong>{{ contributor.name }}</strong>
            </NuxtLink>
            <strong class="profile-publication-contributor" v-else>{{ contributor.name }}</strong>
            <!-- add comas if users is upper than 2, and add "and" beetwen last contributors -->
            <span v-if="idx + 2 < publi.contributors.length">,</span>
            <span v-else-if="idx + 2 == publi.contributors.length">
              {{ ` ${$t('common.and')} ` }}
            </span>
          </span>
        </div>
        <p class="profile-publication-description">{{ publi.description }}</p>
        <div class="public-tags">
          <BadgeItem
            v-for="tag in publi.tags"
            :key="tag.name"
            :label="tag.name"
            :iconName="iconName(tag.perc)"
          />
        </div>
      </article>
    </NuxtLink>
  </div>
</template>

<script setup>
import BadgeItem from '@/components/base/BadgeItem.vue'

defineOptions({
  name: 'UserPublicationsList',
})

const { t } = useNuxtI18n()

const props = defineProps({
  publications: {
    type: Object,
    required: true,
  },
  limit: {
    type: Number,
    default: null,
  },
})

// this create graph
const yearsInfo = computed(() => {
  const info = {
    minYear: null,
    maxYear: null,
    bar: [],
  }
  const years = props.publications.years.sort((a, b) => a.year >= b.year)
  years.forEach((o) => {
    if (info.minYear == null || info.minYear > o.year) {
      info.minYear = o.year
    }
    if (info.maxYear == null || info.maxYear < o.year) {
      info.maxYear = o.year
    }
    info.bar.push({
      count: o.count,
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

const publicationsSliced = computed(() => {
  // if no limit, display all publications
  if (props.limit === null) {
    return props.publications.publications
  }
  return props.publications.publications.slice(0, props.limit)
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
  &:hover {
    background-color: #f5f5f5;
  }
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
</style>
