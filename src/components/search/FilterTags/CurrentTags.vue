<template>
  <div v-if="currentTags.length" class="current-tags-ctn">
    <template v-for="(tag, index) in currentTags">
      <span v-if="showSeparator && index > 0" :key="tag.id">{{ $t('search.or') }}</span>
      <FilterValue
        v-if="tagTexts.title(tag)"
        :key="tag.id"
        :label="tagTexts.title(tag)"
        class="actionable"
        icon="Close"
        @click="removeTag(tag)"
      />
    </template>
  </div>
</template>

<script>
import FilterValue from '@/components/search/Filters/FilterValue.vue'
import useTagTexts from '@/composables/useTagTexts.js'

export default {
  name: 'CurrentTags',

  components: { FilterValue },
  props: {
    currentTags: {
      type: Array,
      default: () => [],
    },

    showSeparator: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['remove-tag'],

  setup() {
    const tagTexts = useTagTexts()
    return {
      tagTexts,
    }
  },

  methods: {
    removeTag(tag) {
      this.$emit('remove-tag', tag)
    },
  },
}
</script>

<style lang="scss" scoped>
.current-tags-ctn {
  display: flex;
  flex-wrap: wrap;
  gap: $space-s;
  align-items: center;
}

.clear-selection {
  text-transform: uppercase;
  color: $primary-dark;
  margin-bottom: pxToRem(24px);
  text-align: center;
  font-weight: 700;
  font-size: $font-size-2xs;
  cursor: pointer;

  svg {
    height: $layout-size-xs;
    fill: $primary-dark;
    margin-right: $space-s;
  }
}
</style>
