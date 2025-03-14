<template>
  <div class="tag-label" :data-test="`tag-label-${label}`">
    <div class="tag-header">
      <span class="tag-name">{{ label }}</span>
      <span v-if="classificationName" class="classification">{{ classificationName }}</span>
    </div>
    <p class="tag-description">
      {{ description }}
    </p>
  </div>
</template>

<script>
import useLanguagesStore from '@/stores/useLanguages'
export default {
  name: 'TagResult',

  props: {
    label: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: '',
    },
    classificationName: {
      type: String,
      default: '',
    },
  },

  setup() {
    const languagesStore = useLanguagesStore()
    return {
      languagesStore,
    }
  },
}
</script>

<style lang="scss" scoped>
.tag-label {
  display: inline-block;
  background: $white;
  border: $border-width-s solid $primary;
  border-radius: $border-radius-l;
  padding: $space-s $space-m;
  color: $primary-dark;
  font-size: $font-size-m;
}

.tag-header {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.classification {
  font-size: 0.7em;
  color: $mid-gray;
}

.tag-name {
  text-transform: uppercase;
}

.tag-description {
  font-size: 0.7em;
}
</style>
