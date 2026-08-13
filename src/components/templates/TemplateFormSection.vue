<script setup lang="ts">
import ContentExpandable from '~/components/base/ContentExpandable.vue'

const props = withDefaults(
  defineProps<{
    title: string
    errors?: boolean
    opened?: boolean
    canDelete?: boolean
  }>(),
  {
    errors: false,
    opened: false,
    canDelete: false,
  }
)

defineEmits<{
  delete: []
}>()
const { stateModal, openModal, toggleModal } = useModal(props.opened)

watchEffect(() => {
  if (props.errors || props.opened) {
    openModal()
  }
})
</script>

<template>
  <section class="list-container">
    <div class="section-header" :class="{ errors }">
      <LpiButton
        secondary
        class="no-border skeletons-background"
        :btn-icon="stateModal ? 'ChevronUp' : 'ChevronDown'"
        @click.prevent="toggleModal"
      />
      <LpiButton
        v-if="errors"
        color="red"
        :title="$t('common.error')"
        class="no-border error-icon skeletons-background"
        btn-icon="Alert"
        @click.prevent="openModal"
      />
      <h4 class="divider-title">
        {{ title }}
      </h4>
      <LpiButton
        v-if="canDelete"
        secondary
        class="no-border skeletons-background"
        btn-icon="TrashCanOutline"
        @click.prevent="$emit('delete')"
      />
    </div>

    <ContentExpandable :opened="stateModal" :height-limit="0" :hide-see-more="true">
      <div class="list-container py4">
        <slot />
      </div>
    </ContentExpandable>
  </section>
</template>

<style lang="scss" scoped>
.divider-title {
  text-align: center;
  font-size: 1.5rem;
  color: var(--primary-dark);

  &::before,
  &::after {
    content: '';
    transform: translateY(-0.4rem);
    display: inline-block;
    width: 3rem;
    height: 0.07rem;
    background-color: var(--primary-dark);
    border-radius: 40px;
  }
}

.section-header {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  background-color: var(--primary-light);
  border-radius: 20px;

  &.errors {
    grid-template-columns: auto auto 1fr auto;
    gap: 0.5rem;
  }
}

.list-title {
  display: flex;
  justify-content: center;
  align-items: center;
}

.error-icon {
  fill: var(--red);
  padding: 0 1rem;
}
</style>
