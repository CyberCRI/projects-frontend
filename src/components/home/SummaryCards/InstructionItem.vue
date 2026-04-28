<template>
  <div class="instruction-item">
    <div class="instruction-title-ctn">
      <h3 class="instruction-title">
        {{ instruction?.$t?.title }}
      </h3>

      <ContextActionMenu
        v-if="canEditInstruction || canDeleteInstruction"
        class="instruction-actions"
        :can-edit="canEditInstruction"
        :can-delete="canDeleteInstruction"
        @edit="$emit('edit-instruction', instruction)"
        @delete="$emit('delete-instruction', instruction)"
      />
    </div>
    <div class="instruction-excerpt" :style="style">
      <HtmlLimiter
        :html="instruction?.$t?.content"
        :striped-tags="['table']"
        class="description-content"
        @computed="layoutComputed"
        @computing="computeLayout"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TranslatedInstruction } from '~/models/instruction.model'

import ContextActionMenu from '~/components/base/button/ContextActionMenu.vue'
import HtmlLimiter from '~/components/base/HtmlLimiter.vue'

defineProps<{
  instruction: TranslatedInstruction
}>()

defineEmits<{
  'delete-instruction': [TranslatedInstruction]
  'edit-instruction': [TranslatedInstruction]
}>()

const { canEditInstruction, canDeleteInstruction } = usePermissions()
const style = ref({})

const computeLayout = () => {
  style.value = {}
}
const layoutComputed = (event) => {
  style.value = { height: event.height + 'px' }
}
</script>
<style scoped lang="scss">
.instruction-item {
  --instruction-dimension: 15rem;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 1rem;
  height: var(--instruction-dimension);
}

.instruction-title-ctn {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.instruction-title {
  font-size: $font-size-xl;
  color: $primary-dark;
}

.instruction-excerpt {
  position: relative;
  flex-grow: 1;
  display: flex;
  flex-flow: column;
  overflow: hidden;

  h1 {
    font-size: $font-size-2xl;
    font-weight: 700;
  }

  h2 {
    font-size: $font-size-xl;
    font-weight: 500;
  }

  h3 {
    font-size: $font-size-l;
    font-weight: 500;
  }

  h4 {
    font-size: $font-size-m;
    font-weight: 500;
  }

  * {
    color: $primary-dark !important;
  }
}
</style>
