<template>
  <div :class="{ 'in-modal': inModal, inline }" class="search-results">
    <div v-if="filteredTagResults?.length" class="search-results-ctn">
      <TagResult
        v-for="tag in filteredTagResults"
        :key="tag.id"
        class="tag-result"
        :class="{ disabled: tag.disabled }"
        :tabindex="tag.disabled ? -1 : 0"
        :label="
          tagTexts.title(tag) + (tag.disabled ? ` ${$t('profile.edit.skills.already-added')}` : '')
        "
        :description="tagTexts.description(tag)"
        :classification-name="tag.classificationName || ''"
        @click="tagClicked(tag)"
      />
    </div>
    <div v-else class="no-result">
      {{ $t('common.no-result') }}
    </div>
  </div>
</template>

<script setup lang="ts">
import TagResult from '~/components/search/FilterTags/TagResult.vue'
import useTagTexts from '~/composables/useTagTexts'

const props = withDefaults(
  defineProps<{
    tagResults?: any[]
    inModal?: boolean
    inline?: boolean
    existingTags?: number[]
  }>(),
  {
    tagResults: () => [],
    inModal: false,
    inline: false,
    existingTags: () => [],
  }
)

const emit = defineEmits<{
  'result-clicked': [any]
}>()

const tagTexts = useTagTexts()

const filteredTagResults = computed(() => {
  return props.tagResults.map((tag) => ({
    ...tag,
    disabled: props.existingTags.includes(tag.id),
  }))
})

const tagClicked = (tag) => {
  if (!tag.disabled) emit('result-clicked', tag)
}
</script>

<style lang="scss" scoped>
.search-results {
  .back-btn {
    margin-left: auto;
  }

  .no-result {
    width: 100%;
    text-align: center;
    font-size: $font-size-l;
    padding-top: $space-2xl;
    font-style: italic;
    color: $mid-gray;
  }

  .search-results-ctn {
    width: 100%;
    display: flex;
    flex-flow: column wrap;
    gap: $space-m;
    align-items: stretch;
    padding-top: $space-l;
    padding-bottom: $space-l;
    box-sizing: border-box;

    .tag-result {
      cursor: pointer;
      text-align: start;
      flex-grow: 1;

      &.disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }
  }
}

.search-results.in-modal .search-results-ctn {
  position: static;
}
</style>
