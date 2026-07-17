<template>
  <NuxtLink
    class="instruction-list-item shadow-box"
    :to="{ name: 'InstructionPage', params: { slugOrId: instruction.id } }"
  >
    <div class="instruction-title-ctn">
      <h3 class="instruction-title skeletons-text">
        {{ instruction.$t.title }}
      </h3>
    </div>

    <ContentExpandable :description="instruction.$t.content" :height-limit="100" hide-see-more />

    <div class="read-more-ctn">
      <SummaryAction
        class="read-button skeletons-text"
        :action-label="t('instructions.list.read-more')"
      />
    </div>

    <ContextActionMenuInline
      class="context-action"
      :can-delete="canDeleteInstruction"
      :can-edit="canEditInstruction"
      @edit="emit('edit-instruction', instruction)"
      @delete="emit('delete-instruction', instruction)"
    />
  </NuxtLink>
</template>
<script setup lang="ts">
import type { TranslatedInstruction } from 'shared-projects-frontend/models'

import { usePermissionInstruction } from '~/composables/usePermissions/useInstructionPermissions'
import ContextActionMenuInline from '~/components/base/button/ContextActionMenuInline.vue'
import SummaryAction from '~/components/home/SummaryCards/SummaryAction.vue'

const props = defineProps<{ instruction: TranslatedInstruction }>()

const { t } = useNuxtI18n()
const emit = defineEmits<{
  'delete-instruction': [TranslatedInstruction]
  'edit-instruction': [TranslatedInstruction]
}>()

const { canEditInstruction, canDeleteInstruction } = usePermissionInstruction(
  computed(() => props.instruction.id)
)
</script>

<style lang="scss" scoped>
@use '~/design/scss/variables';

.instruction-list-item {
  --instruction-dimension: 13rem;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 1rem;
  height: var(--instruction-dimension);
  padding: 1rem;
  border: variables.$border-width-s solid variables.$lighter-gray;
  border-radius: 1rem;
}

.instruction-title-ctn {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.instruction-title {
  font-size: variables.$font-size-xl;
}

.context-action {
  position: absolute;
  top: 0;
  right: 0;
  margin: 0.5rem;
}

.instruction-excerpt {
  position: relative;
  flex-grow: 1;
  display: flex;
  flex-flow: column;
  overflow: hidden;

  h1 {
    font-size: variables.$font-size-2xl;
    font-weight: 700;
  }

  h2 {
    font-size: variables.$font-size-xl;
    font-weight: 500;
  }

  h3 {
    font-size: variables.$font-size-l;
    font-weight: 500;
  }

  h4 {
    font-size: variables.$font-size-m;
    font-weight: 500;
  }
}

.read-more-ctn {
  flex-shrink: 0;
  padding: 1rem 0;

  .read-button {
    width: min-content;
    padding-left: 0;
  }
}
</style>
