<template>
  <div class="separator"></div>
  <div class="teaching">
    <h2 class="teaching-title skeletons-text">{{ teaching.$t.name }}</h2>
    <div class="teaching-header">
      <span class="teaching-header-item skeletons-background">
        <IconImage name="SchoolOutline" class="teaching-header-icon" />
        <span class="teaching-header-label">{{ teaching.level }}</span>
      </span>
      <span class="teaching-header-item skeletons-background">
        <IconImage name="Article" class="teaching-header-icon" />
        <span class="teaching-header-label">{{ teaching.$t.spec }}</span>
      </span>
    </div>
    <p class="teaching-decription skeletons-text">
      {{ teaching.$t.description }}
    </p>
    <div class="teaching-domains">
      <ResearcherDomain
        v-for="domain in teaching.domains"
        :key="domain.domain.id"
        :domain="domain"
      />
    </div>
    <div class="teaching-footer">
      <LinkButton
        v-if="teaching.link"
        :to="teaching.link"
        :label="$t('common.see-more')"
        btn-icon="ExternalLink"
      />
      <!-- <LinkButton
              :to="teaching.similars.link"
              :label="$t('researcher.similar-teaching', { count: teaching.similars.count })"
              btn-icon="ArrowRight"
            /> -->
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { TranslatedTeaching } from 'shared-projects-frontend/models'

defineProps<{
  teaching: TranslatedTeaching
}>()
</script>

<style lang="scss" scoped>
@use '~/design/scss/variables';

.teaching {
  display: flex;
  flex-flow: column nowrap;
  gap: 1rem;
}

.teaching-title {
  font-size: 1.2rem;
}

.teaching-header,
.teaching-domains,
.teaching-footer {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.teaching-header-item {
  display: inline-flex;
  gap: 0.8rem;
  align-items: center;
}

.teaching-header-icon {
  fill: variables.$primary;
  width: 1.2em;
  aspect-ratio: 1;
}

.separator {
  margin-block: 1rem;
  display: none;
  background-color: variables.$light-gray;
  height: 1px;
}

.teaching ~ .separator {
  display: block;
}
</style>
