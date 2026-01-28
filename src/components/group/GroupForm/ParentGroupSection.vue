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
        @click="open"
      />
    </label>

    <div v-if="model" class="group-grid">
      <GroupCard :group="model" />
    </div>

    <PickGroupDrawer
      :drawer-title="t('group.form.add-parent-group')"
      :subtitle="t('admin.groups.subtitle-edit-child')"
      :is-opened="state"
      :groups="groups"
      :initial-group="model"
      :rooted="true"
      @close="close"
      @confirm="confirmGroup"
    />
  </div>
</template>

<script setup lang="ts">
import useModal from '@/composables/useModal'
import { TranslatedPeopleGroupModel } from '@/models/invitation.model'

withDefaults(
  defineProps<{
    groups?: TranslatedPeopleGroupModel[]
  }>(),
  {
    groups: () => [],
  }
)
const model = defineModel<TranslatedPeopleGroupModel | null>()

const { t } = useNuxtI18n()
const { close, open, state } = useModal()

const confirmGroup = (group) => {
  model.value = group
  close()
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
