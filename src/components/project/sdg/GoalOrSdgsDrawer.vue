<template>
  <BaseDrawer
    :is-opened="isOpened"
    :title="$t('profile.edit.skills.mentorship.choose')"
    class="small"
    no-footer
    @close="close"
  >
    <div class="select-added-item">
      <LpiButton
        :label="$t('project.add-to-project.sdg')"
        btn-icon="Plus"
        data-test="button-add-sdg-to-project"
        class="button-select"
        @click="$emit('choice-made', 'sdg')"
      />
      <LpiButton
        :label="$t('project.add-to-project.goal')"
        btn-icon="Plus"
        data-test="button-add-goal-to-project"
        class="button-select"
        @click="$emit('choice-made', 'goal')"
      />
    </div>
  </BaseDrawer>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    isOpened?: boolean
  }>(),
  { isOpened: false }
)

const emit = defineEmits<{
  'choice-made': ['sdg' | 'goal']
  close: []
}>()

const close = () => emit('close')
</script>
<style scoped lang="scss">
.select-added-item {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: stretch;

  .button-select {
    margin: $space-l;
  }
}
</style>
