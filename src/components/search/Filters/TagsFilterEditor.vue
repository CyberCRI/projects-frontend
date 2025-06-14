<template>
  <div class="tags-filter-editor">
    <div class="section">
      <CurrentTags
        :current-tags="tags"
        class="current-tags"
        :show-separator="!hideCurrentTagsSeparator"
        @remove-tag="removeTag"
      />
    </div>

    <div v-if="!allSearchMode" class="section">
      <p class="notice">
        {{ $t('search.pick-tag-classification') }}
      </p>

      <LpiSelect
        v-model="selectedClassificationId"
        data-test="classification-picker"
        :options="orgClassificationOptions"
      />

      <ClassificationDescription
        v-if="selectedClassification"
        :classification="selectedClassification"
      />
    </div>

    <div v-show="allSearchMode || selectedClassification || showTagSearch" class="section">
      <p class="notice">
        {{ $t('search.current-tag-description') }}
      </p>

      <FilterSearchInput
        ref="search-input-component"
        v-model.trim="search"
        data-test="tag-search-input"
        :placeholder="$t('search.search-tag')"
        class="search-input-ctn"
      />

      <TagResults
        v-if="search || showPreSearchList"
        data-test="tag-results"
        :classification-id="selectedClassificationId"
        :existing-tags="alreadySelectedTags"
        :search="search"
        :search-all="allSearchMode"
        :show-pre-search-list="showPreSearchList"
        type="projects"
        @add-tag="onAddTag"
      />

      <template v-else-if="suggestedTags.length">
        <p class="notice notice-suggested">
          {{ $t('search.pick-tag-preset') }}
        </p>
        <SuggestedTags
          data-test="suggested-tags"
          :current-tags="alreadySelectedTags"
          :suggested-tags="suggestedTags"
          :loading="suggestedTagsAreLoading"
          @add-tag="addTag"
        />
      </template>
    </div>
  </div>
</template>

<script>
import FilterSearchInput from '@/components/search/Filters/FilterSearchInput.vue'
import CurrentTags from '@/components/search/FilterTags/CurrentTags.vue'
import SuggestedTags from '@/components/search/FilterTags/SuggestedTags.vue'
import TagResults from '@/components/search/FilterTags/TagResults.vue'
import LpiSelect from '@/components/base/form/LpiSelect.vue'
import useTagSearch from '@/composables/useTagSearch.js'
import ClassificationDescription from '@/components/admin/ClassificationDescription.vue'
export default {
  name: 'TagsFilterEditor',

  components: {
    FilterSearchInput,
    CurrentTags,
    SuggestedTags,
    TagResults,
    LpiSelect,
    ClassificationDescription,
  },

  props: {
    modelValue: {
      type: Array,
      default: () => [],
    },
    blockedTags: {
      // unselctable tags (already selected ones)
      type: Array,
      default: () => [],
    },

    hideOrganizationTags: {
      // dont show org suggested tags
      type: Boolean,
      default: false,
    },
    progressiveUpdate: {
      // if false emit specific event instead of model update
      // see ProjectForm
      type: Boolean,
      default: true,
    },
    allSearchMode: {
      // search all org classification
      // or a picked one
      type: Boolean,
      default: true,
    },
    hideCurrentTagsSeparator: {
      // hide "or" separator between selected tags
      type: Boolean,
      default: false,
    },
  },

  emits: ['update:modelValue', 'update-tags'],
  setup(props) {
    const {
      suggestedTagsAreLoading,
      selectedClassification,
      selectedClassificationId,
      search,
      suggestedTags,
      orgClassifications,
      orgClassificationOptions,
      showTagSearch,
      resetTagSearch,
    } = useTagSearch({
      useProjects: true,
      hideOrganizationTags: props.hideOrganizationTags,
    })
    return {
      suggestedTagsAreLoading,
      selectedClassification,
      selectedClassificationId,
      search,
      suggestedTags,
      orgClassifications,
      orgClassificationOptions,
      showTagSearch,
      resetTagSearch,
    }
  },

  data() {
    return {
      tags: [],
    }
  },

  computed: {
    alreadySelectedTags() {
      return [...this.tags.map((t) => t.id), ...this.blockedTags.map((t) => t.id)]
    },
    showPreSearchList() {
      return !this.allSearchMode && this.selectedClassification && !this.search
    },
  },

  watch: {
    queryString(val) {
      if (val.length >= 3) {
        this.focusInput()
      }
    },

    modelValue: {
      handler: function (neo) {
        this.tags = [...neo]
      },
      immediate: true,
      deep: true,
    },

    showPreSearchList: {
      handler: function (val) {
        if (val) {
          this.focusInput()
        }
      },
      immediate: true,
    },
  },

  mounted() {
    this.focusInput()
    // this.resetTagSearch()
  },

  methods: {
    addTag(tag) {
      this.tags.push(tag)
      if (this.progressiveUpdate) {
        this.$emit('update:modelValue', this.tags)
      } else {
        this.$emit('update-tags', this.tags)
      }
    },

    focusInput() {
      const searchInput = this.$refs['search-input-component']?.$refs['search-input']
      if (searchInput)
        this.$nextTick(() => {
          searchInput.focus()
        })
    },

    onAddTag(result) {
      this.addTag(result)
      this.search = ''
      this.focusInput()
    },

    removeTag(tag) {
      const tagIndex = this.tags.findIndex(
        (element) => element.id === tag.id && element.name === tag.name
      )
      this.tags.splice(tagIndex, 1)
      if (this.progressiveUpdate) {
        this.$emit('update:modelValue', this.tags)
      } else {
        this.$emit('update-tags', this.tags)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.section {
  margin-bottom: $space-m;
}

.notice {
  font-size: $font-size-s;
  margin-bottom: $space-s;
}

.notice-suggested {
  margin-top: $space-m;
}

.current-tags {
  margin-top: pxToRem(16px);
}

.input-ctn {
  width: 100%;

  label {
    align-self: flex-start;
  }

  input {
    width: 100%;
  }
}

.lpi-select {
  width: 100%;
}

.classification-description {
  margin-top: $space-m;
  margin-left: $space-m;
}
</style>
