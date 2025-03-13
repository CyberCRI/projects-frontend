<template>
  <div class="filter-members-summary">
    <FilterValue
      v-for="(member, index) in selection"
      :key="member.id"
      :label="member.name.fullname"
      icon="Close"
      class="actionable"
      @click="removeFilter(index)"
    />
  </div>
</template>

<script>
import FilterValue from '@/components/search/Filters/FilterValue.vue'

export default {
  name: 'MembersFilterSummary',

  components: {
    FilterValue,
  },

  props: {
    modelValue: {
      type: Array,
      required: true,
    },
  },

  emits: ['update:model-value'],

  data() {
    return {
      selection: [],
      memberSearch: '',
      memberList: [],
    }
  },

  watch: {
    modelValue: {
      handler: function (neo, old) {
        if (neo && neo != old) {
          this.selection = [...neo]
        }
      },
      immediate: true,
      deep: true,
    },
  },

  mounted() {
    this.selection = [...this.modelValue]
  },

  methods: {
    removeFilter(index) {
      this.selection.splice(index, 1)
      this.$emit('update:model-value', this.selection)
    },
  },
}
</script>

<style scoped lang="scss">
.filter-members-summary {
  display: flex;
  flex-wrap: wrap;
  gap: $space-2xs;
}
</style>
