<template>
  <li class="sub-list">
    <div class="top-list">
      <div class="name black-text">
        {{ label }}
      </div>
      <div class="actions">
        <ContextActionMenu>
          <ContextActionButton
            v-if="actionEdit"
            action-icon="Pen"
            class="edit-btn small"
            secondary
            no-border
            data-test="action-edit"
            :action-label="t('common.edit')"
            @click.stop.prevent="emit('edit')"
          />

          <ContextActionButton
            v-if="actionAdd"
            action-icon="Plus"
            class="edit-btn small"
            secondary
            no-border
            data-test="action-add"
            :action-label="t('common.add')"
            @click.stop.prevent="emit('add')"
          />

          <ContextActionButton
            v-if="actionSee"
            action-icon="Eye"
            class="edit-btn small"
            secondary
            no-border
            data-test="action-see"
            :action-label="t('common.see')"
            @click.stop.prevent="emit('see')"
          />

          <ContextActionButton
            v-if="actionDelete"
            action-icon="TrashCanOutline"
            class="edit-btn small"
            secondary
            no-border
            data-test="action-delete"
            :action-label="t('common.delete')"
            @click.stop.prevent="emit('delete')"
          />
        </ContextActionMenu>
      </div>
    </div>
  </li>
</template>

<script setup>
import ContextActionMenu from '@/components/base/button/ContextActionMenu.vue'
import ContextActionButton from '@/components/base/button/ContextActionButton.vue'
import useNuxtI18n from '@/composables/useNuxtI18n'

defineOptions({
  name: 'AdminListItem',
})

const { t } = useNuxtI18n()

defineProps({
  label: {
    type: String,
    required: true,
  },
  actionEdit: {
    type: Boolean,
    default: true,
  },
  actionAdd: {
    type: Boolean,
    default: true,
  },
  actionSee: {
    type: Boolean,
    default: true,
  },
  actionDelete: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['edit', 'add', 'see', 'delete'])
</script>

<style lang="scss" scoped>
.top-list {
  flex-grow: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: solid $lighter-gray 1px;
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
  fill: $lighter-gray;
}

.black-text {
  color: $almost-black;
  font-weight: 400;
}
</style>
