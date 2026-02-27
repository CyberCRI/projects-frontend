<template>
  <div class="group-section">
    <label>
      <span class="section-title">
        {{ t('group.form.parent-group-label') }}
      </span>

      <LpiButton
        class="add-parent-group-card"
        :btn-icon="model ? 'Pen' : 'Plus'"
        :label="t(model ? 'group.form.edit' : 'group.form.add')"
        data-test="add-parent-group-card"
        @click="openModal()"
      />
    </label>

    <div v-if="model" class="group-grid">
      <GroupCard :group="model" mode="list" />
    </div>

    <PickGroupDrawer
      :drawer-title="t('group.form.add-parent-group')"
      :subtitle="t('admin.groups.subtitle-edit-child')"
      :is-opened="stateModal"
      :groups="children"
      :initial-group="model"
      :rooted="true"
      @close="closeModal()"
      @confirm="confirmGroup"
    />
  </div>
</template>

<script setup lang="ts">
import { getHierarchyGroups } from '@/api/v2/group.service'
import { TranslatedPeopleGroupModel } from '@/models/invitation.model'

const props = defineProps<{
  organizationCode: string
}>()
const model = defineModel<TranslatedPeopleGroupModel | null>()

const { t } = useNuxtI18n()
const { closeModal, openModal, stateModal } = useModal()

const { data: group } = getHierarchyGroups(props.organizationCode)
const children = computed(() => group.value.children)

const confirmGroup = (group) => {
  model.value = group
  closeModal()
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
    grid-template-columns: 1fr;
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
