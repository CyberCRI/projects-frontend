<script setup lang="ts">
import ContentExpandable from '~/components/base/ContentExpandable.vue'

const props = withDefaults(
  defineProps<{
    title: string
    errors?: boolean
  }>(),
  {
    errors: false,
  }
)

const { stateModal, openModal, toggleModal } = useModal(false)

watchEffect(() => {
  if (props.errors) {
    openModal()
  }
})
</script>

<template>
  <section class="list-container">
    <div class="section-header">
      <LpiButton
        secondary
        class="no-border skeletons-background"
        :btn-icon="stateModal ? 'ChevronUp' : 'ChevronDown'"
        @click.prevent="toggleModal"
      />
      <h4 class="divider-title">
        {{ title }}
      </h4>
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
  color: $primary-dark;

  &::before,
  &::after {
    content: '';
    transform: translateY(-0.4rem);
    display: inline-block;
    width: 3rem;
    height: 0.07rem;
    background-color: $primary-dark;
    border-radius: 40px;
  }
}

.section-header {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  background-color: var(--primary-light);
  border-radius: 20px;
}

.list-title {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
