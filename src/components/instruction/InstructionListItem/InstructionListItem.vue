<template>
  <NuxtLink
    class="instruction-list-item shadow-box"
    :to="{ name: 'InstructionPage', params: { slugOrId: instruction.id } }"
  >
    <div class="instruction-title-ctn">
      <h3 class="instruction-title">
        {{ instruction.title }}
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
        :html="instruction.content"
        :striped-tags="['table']"
        class="description-content"
        @computed="layoutComputed"
        @computing="computeLayout"
      />
    </div>
    <div class="read-more-ctn">
      <SummaryAction class="read-button" :action-label="$t('instructions.list.read-more')" />
    </div>
  </NuxtLink>
</template>
<script>
import ContextActionMenu from '@/components/base/button/ContextActionMenu.vue'
import SummaryAction from '@/components/home/SummaryCards/SummaryAction.vue'
import HtmlLimiter from '@/components/base/HtmlLimiter.vue'

export default {
  name: 'InstructionListItem',

  components: {
    SummaryAction,
    HtmlLimiter,
    ContextActionMenu,
  },

  props: {
    instruction: {
      type: Object,
      required: true,
    },
  },

  emits: ['delete-instruction', 'edit-instruction'],

  setup() {
    const { canEditInstruction, canDeleteInstruction } = usePermissions()
    return { canEditInstruction, canDeleteInstruction }
  },

  data() {
    return {
      style: {},
    }
  },

  methods: {
    computeLayout() {
      this.style = {}
    },
    layoutComputed(event) {
      this.style = { height: event.height + 'px' }
    },
  },
}
</script>
<style scoped lang="scss">
.instruction-list-item {
  --instruction-dimension: 13rem;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 1rem;
  height: var(--instruction-dimension);
  padding: 1rem;
  border: $border-width-s solid $lighter-gray;
  border-radius: 1rem;
}

.instruction-title-ctn {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.instruction-title {
  font-size: $font-size-xl;
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
