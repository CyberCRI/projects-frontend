<template>
  <li class="sub-list">
    <div class="top-list">
      <div class="name black-text skeletons-text">
        {{ label }}
      </div>
      <div class="actions skeletons-background">
        <ContextActionMenuInline
          :can-delete="actionDelete"
          :can-edit="actionEdit"
          @delete="$emit('delete')"
          @edit="$emit('edit')"
        >
          <ContextActionButton
            v-if="actionSee"
            action-icon="Eye"
            class="edit-btn small"
            secondary
            no-border
            data-test="action-see"
            :action-label="t('common.see')"
            @click.stop.prevent="$emit('see')"
          />

          <ContextActionButton
            v-if="actionAdd"
            action-icon="Plus"
            class="edit-btn small"
            secondary
            no-border
            data-test="action-add"
            :action-label="t('common.add')"
            @click.stop.prevent="$emit('add')"
          />
        </ContextActionMenuInline>
      </div>
    </div>
  </li>
</template>

<script setup lang="ts">
import ContextActionButton from '~/components/base/button/ContextActionButton.vue'
import useNuxtI18n from '~/composables/useNuxtI18n'

const { t } = useNuxtI18n()

withDefaults(
  defineProps<{
    label: string
    actionEdit?: boolean
    actionAdd?: boolean
    actionSee?: boolean
    actionDelete?: boolean
  }>(),
  {
    actionEdit: true,
    actionAdd: true,
    actionSee: true,
    actionDelete: true,
  }
)
defineEmits<{
  edit: []
  add: []
  see: []
  delete: []
}>()
</script>

<style lang="scss" scoped>
.top-list {
  flex-grow: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: solid var(--lighter-gray) 1px;
}

.sub-list {
  flex-grow: 1;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  width: 100%;
}

li {
  display: flex;
}

.actions {
  align-self: center;
}

.texts {
  display: grid;
  width: 100%;
  box-sizing: border-box;
  align-items: center;
  grid-template-columns: 25px 1fr;
}

.icon-td {
  width: pxToRem(25px);
  padding: 7px;
}

.name {
  padding: $space-unit;
}

.grey-color {
  fill: var(--lighter-gray);
}

.black-text {
  color: var(--almost-black);
  font-weight: 400;
}
</style>
