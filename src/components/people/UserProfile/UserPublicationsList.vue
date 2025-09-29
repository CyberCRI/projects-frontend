<template>
  <div>
    <NuxtLink
      :to="{ name: 'ProfilePublicationsOther', params: { publicationId: publi.id } }"
      v-for="publi in publicationsSliced"
      :key="publi.id"
      class="profile-publications-container"
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
            <span v-else-if="idx == publi.contributors.length - 2">
              {{ ` ${$t('common.and')} ` }}
            </span>
          </span>
        </div>
        <p class="profile-publication-description">{{ publi.description }}</p>
      </article>
    </NuxtLink>
  </div>
</template>

<script setup>
defineOptions({
  name: 'UserPublicationsList',
})

const props = defineProps({
  publications: {
    type: Array,
    required: true,
  },
  limit: {
    type: Number,
    default: null,
  },
})

const publicationsSliced = computed(() => {
  // if no limit, display lal publications
  if (props.limit === null) {
    return props.publications
  }
  return props.publications.slice(0, props.limit)
})
</script>

<style lang="scss" scoped>
$profile-publications: 2rem;
.profile-publications-container {
  display: flex;
  flex-direction: column;
  justify-items: start;
  gap: $profile-publications;

  &:not(:last-child)::after {
    content: '';
    width: 120px;
    height: 2px;
    opacity: 0.7;
    background-color: #d4d4d4;
    transform: translateY(calc($profile-publications / 2 * -1));
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
</style>
