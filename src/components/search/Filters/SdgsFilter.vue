<template>
  <div class="sdg-filter-container">
    <SdgIcon
      v-for="(selected, sdgId) in sdgsFilters"
      :key="sdgId"
      :sdg-id="sdgId"
      :selected="selected"
      @toggled="toggleSdg"
    />
  </div>
</template>

<script>
import SdgIcon from '@/components/search/Filters/SdgIcon.vue'
import allSdgs from '@/data/sdgs.json'

export default {
  name: 'SdgsFilter',

  components: { SdgIcon },

  props: {
    modelValue: {
      type: Array,
      default: () => [],
    },
  },

  emits: ['update:modelValue'],

  computed: {
    sdgsFilters() {
      return allSdgs.reduce((acc, sdg) => {
        acc[sdg.id] = this.modelValue.some((selected_id) => selected_id == sdg.id)
        return acc
      }, {})
    },
  },

  methods: {
    toggleSdg(sdgId) {
      this.sdgsFilters[sdgId] = !this.sdgsFilters[sdgId]
      this.$emit(
        'update:modelValue',
        Object.entries(this.sdgsFilters)
          .filter((entry) => entry[1])
          .map((entry) => entry[0])
      )
    },
  },
}
</script>

<style lang="scss" scoped>
.sdg-filter-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: pxToRem(16px);
  justify-items: center;
}

@media screen and (min-width: $max-mobile) {
  .sdg-filter-container {
    grid-template-columns: 1fr 1fr 1fr;
  }
}

@media screen and (min-width: $min-tablet) {
  .sdg-filter-container {
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  }
}
</style>
