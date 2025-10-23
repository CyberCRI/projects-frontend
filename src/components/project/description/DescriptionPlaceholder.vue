<template>
  <div class="description-placeholder">
    <p class="text">
      {{ $t('description.placeholder') }}
    </p>

    <LpiButton
      :label="capitalize($t('description.add'))"
      btn-icon="ArrowRight"
      :reversed-order="true"
      data-test="add-description-button"
      @click="editDescriptionModalActive = !editDescriptionModalActive"
    />

    <DescriptionDrawer
      v-if="editDescriptionModalActive"
      :is-opened="editDescriptionModalActive"
      :project="project"
      @close="close"
    />
  </div>
</template>

<script setup>
import { capitalize } from '@/functs/string'

import DescriptionDrawer from '@/components/project/description/DescriptionDrawer.vue'
import LpiButton from '@/components/base/button/LpiButton.vue'

defineOptions({ name: 'DescriptionPlaceholder' })
defineProps({
  project: {
    type: Object,
    required: true,
  },
})

const editDescriptionModalActive = ref(false)
const close = () => (editDescriptionModalActive.value = !editDescriptionModalActive.value)
</script>

<style lang="scss" scoped>
.description-placeholder {
  background: $primary-lighter;
  border-radius: $border-radius-l;
  padding: $space-l;
  display: flex;
  flex-direction: column;
  align-items: center;

  .text {
    margin-bottom: $space-l;
  }
}
</style>
