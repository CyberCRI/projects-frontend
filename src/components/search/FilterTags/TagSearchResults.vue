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

<script>
import TagResult from '@/components/search/FilterTags/TagResult.vue'
import useUsersStore from '@/stores/useUsers.ts'
import useTagTexts from '@/composables/useTagTexts.js'

export default {
  name: 'TagSearchResults',

  components: { TagResult },
  props: {
    tagResults: {
      // array of tag objects
      type: Array,
      default: () => [],
    },
    inModal: {
      type: Boolean,
      default: false,
    },
    inline: {
      type: Boolean,
      default: false,
    },
    existingTags: {
      // array of tag ids
      type: Array,
      default: () => [],
    },
  },

  emits: ['result-clicked'],
  setup() {
    const usersStore = useUsersStore()
    const tagTexts = useTagTexts()
    return {
      usersStore,
      tagTexts,
    }
  },

  computed: {
    filteredTagResults() {
      return this.tagResults.map((tag) => ({
        ...tag,
        disabled: this.existingTags.includes(tag.id),
      }))
    },
  },

  methods: {
    tagClicked(tag) {
      if (!tag.disabled) this.$emit('result-clicked', tag)
    },
  },
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
