<template>
  <Field :label="t('group.form.parent-group-label')">
    <template #in-label>
      <LpiButton
        class="add-parent-group-card"
        :btn-icon="model ? 'Pen' : 'Plus'"
        :label="t(model ? 'group.form.edit' : 'group.form.add')"
        data-test="add-parent-group-card"
        @click="openModal()"
      />
    </template>

    <div v-if="model" class="group-grid">
      <GroupCard :group="model" mode="list" />
    </div>
    <empty-label v-if="!model" />

    <PickGroupDrawer
      :drawer-title="t('group.form.add-parent-group')"
      :subtitle="t('admin.groups.subtitle-edit-child')"
      :is-opened="stateModal"
      :groups="children"
      :initial-group="model"
      :rooted="true"
      :status="status"
      @close="closeModal()"
      @confirm="confirmGroup"
    />
  </Field>
</template>

<script setup lang="ts">
import type { TrasnlatedHierarchyGroupModel } from 'shared-projects-frontend/models'
import { getHierarchyGroups } from '~/api/v2/group.service'

const props = defineProps<{
  organizationCode: string
}>()
const model = defineModel<TrasnlatedHierarchyGroupModel | null>()

const { t } = useNuxtI18n()
const { closeModal, openModal, stateModal } = useModal()

const { data: group, status } = getHierarchyGroups(props.organizationCode, {
  query: {
    modules: 'none',
  },
})
const children = computed(() => group.value.children)

const confirmGroup = (group) => {
  model.value = group
  closeModal()
}
</script>

<style lang="scss" scoped>
@use '~/design/scss/variables';

.group-section {
  label {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
    width: 100%;
    font-size: variables.$font-size-m;
    margin-bottom: variables.$space-l;

    .section-title {
      color: variables.$black;
      font-weight: bold;
      display: block;
    }
  }

  .group-grid {
    display: grid;
    grid-template-columns: 1fr;
    justify-items: stretch;
    gap: variables.$space-l;
  }

  .disabled {
    color: variables.$almost-white;

    svg {
      width: 18px;
      fill: variables.$almost-white;
    }
  }
}
</style>
