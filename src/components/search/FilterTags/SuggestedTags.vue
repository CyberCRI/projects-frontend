<template>
  <div>
    <div v-if="loading" class="loader-ctn">
      <LoaderSimple />
    </div>
    <div v-else-if="displayableTags.length" class="suggested-tags-ctn">
      <div v-for="tag in displayableTags" :key="tag.id">
        <FilterValue
          v-if="tagTexts.title(tag)"
          :label="tagTexts.title(tag)"
          class="actionable suggested"
          @click="addTag(tag)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import FilterValue from '@/components/search/Filters/FilterValue.vue'
import LoaderSimple from '@/components/base/loader/LoaderSimple.vue'
import useTagTexts from '@/composables/useTagTexts.js'

export default {
  name: 'SuggestedTags',

  components: { FilterValue, LoaderSimple },
  props: {
    currentTags: {
      // array of tag ids
      type: Array,
      default: () => [],
    },

    suggestedTags: {
      // array of tag objects
      type: Array,
      default: () => [],
    },

    loading: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['add-tag'],

  setup() {
    const tagTexts = useTagTexts()
    return {
      tagTexts,
    }
  },

  computed: {
    displayableTags() {
      return this.suggestedTags.filter((tag) => !this.currentTags.includes(tag.id))
    },
  },

  methods: {
    addTag(tag) {
      this.$emit('add-tag', tag)
    },
  },
}
</script>

<style lang="scss" scoped>
.suggested-tags-ctn {
  background: $primary-lighter;
  border-radius: $border-radius-xs;
  padding: $space-m;
  display: flex;
  flex-wrap: wrap;
  gap: $space-s;
}

.loader-ctn {
  padding: $space-m;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
