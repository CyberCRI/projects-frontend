<script setup lang="ts">
import ContentExpandable from '~/components/base/ContentExpandable.vue'
import IconImage from '~/components/base/media/IconImage.vue'
import type { IconImageChoice } from '~/functs/IconImage'

const props = withDefaults(
  defineProps<{
    title: string
    errors?: boolean
    opened?: boolean
    canDelete?: boolean
    canVisibility?: boolean
    icon?: IconImageChoice
  }>(),
  {
    errors: false,
    opened: false,
    canDelete: false,
    canVisibility: false,
    icon: null,
  }
)

defineEmits<{
  delete: []
}>()
const { stateModal, openModal, toggleModal } = useModal(props.opened)

const visibility = defineModel<boolean>('visibility', { default: true })

watchEffect(() => {
  if (props.errors || props.opened) {
    openModal()
  }
})
</script>

<template>
  <section class="list-container shadowed-box">
    <div class="section-header" :class="{ errors }">
      <slot name="left" />
      <LpiButton
        secondary
        :aria-label="$t('common.expand')"
        class="no-border skeletons-background"
        :btn-icon="stateModal ? 'ChevronUp' : 'ChevronDown'"
        @click.prevent="toggleModal"
      />
      <LpiButton
        v-if="errors"
        color="red"
        :aria-label="$t('common.error')"
        class="no-border error-icon skeletons-background"
        btn-icon="Alert"
        @click.prevent="openModal"
      />
      <span class="title">
        <IconImage v-if="icon" class="icon" :name="icon" />
        <span>
          {{ title }}
        </span>
      </span>

      <LpiButton
        v-if="canDelete"
        secondary
        class="no-border skeletons-background"
        btn-icon="TrashCanOutline"
        :aria-label="$t('common.delete')"
        @click.prevent="$emit('delete')"
      />
      <GroupButton
        v-if="canVisibility"
        v-model="visibility"
        :options="[
          {
            label: $t('tab.form.show_tab.show'),
            iconName: 'Eye' satisfies IconImageChoice as IconImageChoice,
            value: true,
          },
          {
            label: $t('tab.form.show_tab.hide'),
            iconName: 'EyeSlash' satisfies IconImageChoice as IconImageChoice,
            value: false,
          },
        ]"
        :has-icon="true"
      />
    </div>

    <ContentExpandable :opened="stateModal" :height-limit="0" :hide-see-more="true">
      <div class="list-container p4">
        <slot />
      </div>
    </ContentExpandable>
  </section>
</template>

<style lang="scss" scoped>
@use '~/components/base/navigation/navpanel-menu-entry';

.list-container {
  gap: 0;
  border-radius: 20px;
  padding: 0.5rem;
}

.title {
  display: flex;
  place-items: center center;
  gap: 0.5rem;
  margin: 0 1rem;
  color: var(--primary-dark);
  fill: var(--primary-dark);
}

.section-header {
  display: grid;
  grid-template-columns: auto auto 1fr auto auto;
  align-items: center;
  gap: 0.5rem;

  &.errors {
    grid-template-columns: auto auto auto 1fr auto auto;
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
