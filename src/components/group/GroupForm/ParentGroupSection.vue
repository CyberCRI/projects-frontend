<template>
  <div class="group-section">
    <label>
      <span class="section-title">
        {{ capitalize(t('group.form.parent-group-label')) }}
      </span>

      <LpiButton
        class="add-parent-group-card"
        :btn-icon="modelValue ? 'Pen' : 'Plus'"
        :label="capitalize(t(modelValue ? 'group.form.edit' : 'group.form.add'))"
        data-test="add-parent-group-card"
        @click="drawerIsOpen = true"
      />
    </label>

    <div v-if="modelValue" class="group-grid">
      <GroupCard :group="modelValue" />
    </div>

    <PickGroupDrawer
      :drawer-title="t('group.form.add-parent-group')"
      :subtitle="t('admin.groups.subtitle-edit-child')"
      :is-opened="drawerIsOpen"
      :groups="groups"
      :initial-group="modelValue"
      :forbidden-ids="forbiddenIds"
      :rooted="true"
      @close="closeDrawer"
      @confirm="confirmGroup"
    />
  </div>
</template>

<script setup>
import { capitalize } from '@/functs/string'

defineOptions({ name: 'ParentGroupSection' })

defineProps({
  modelValue: {
    type: [Object, null],
    default: null,
  },
  groups: {
    type: Array,
    default: () => [],
  },
})

const emits = defineEmits(['update:modelValue'])
const { t } = useNuxtI18n()
const drawerIsOpen = ref(false)
const forbiddenIds = ref([])

const closeDrawer = () => {
  drawerIsOpen.value = false
}
const confirmGroup = (group) => {
  emits('update:modelValue', group)
  closeDrawer()
}
</script>

<style lang="scss" scoped>
.group-section {
  label {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
    width: 100%;
    font-size: $font-size-m;
    margin-bottom: $space-l;

    .section-title {
      color: $black;
      font-weight: bold;
      display: block;
    }
  }

  .group-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    justify-items: stretch;
    gap: $space-l;
  }

  .disabled {
    color: $almost-white;

    svg {
      width: 18px;
      fill: $almost-white;
    }
  }
}
</style>
