<template>
  <div class="language-filter">
    <LpiCheckbox
      v-for="(language, index) in languages"
      :key="index"
      v-model="language.selected"
      class="as-button min-width"
      :label="$t('language.label-' + language.label)"
    />
  </div>
</template>

<script>
import LpiCheckbox from '@/components/base/form/LpiCheckbox.vue'
import useOrganizationsStore from '@/stores/useOrganizations.ts'

export default {
  name: 'LanguageFilter',

  components: { LpiCheckbox },
  props: {
    modelValue: {
      type: Array,
      required: true,
    },
  },

  emits: ['update:modelValue'],

  setup() {
    const organizationsStore = useOrganizationsStore()
    return {
      organizationsStore,
    }
  },

  data() {
    return {
      languages: this.organizationsStore.languages.map((lang) => ({
        label: lang,
        selected: this.modelValue.some((l) => l == lang),
      })),
    }
  },

  watch: {
    languages: {
      handler: function (neo) {
        this.$emit(
          'update:modelValue',
          neo.filter((lang) => lang.selected).map((lang) => lang.label)
        )
      },
      deep: true,
    },
  },
}
</script>

<style lang="scss" scoped>
.language-filter {
  width: 100%;
  display: flex;
  flex-flow: column wrap;
  gap: 1rem;
}
</style>
