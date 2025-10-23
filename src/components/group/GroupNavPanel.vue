<template>
  <NavPanelAside>
    <div v-if="canEditGroup" class="edit-btn-ctn">
      <GroupButton
        :model-value="isEditing"
        :options="[
          { value: false, label: 'Show' },
          { value: true, label: 'Edit' },
        ]"
        btn-icon="Pen"
        :data-test="isEditing ? 'show-group' : 'edit-group'"
        class="panel-mode-switcher edit-btn small"
        @update:model-value="switchView"
      />
    </div>

    <NavPanelMenu :menu-entries="groupTabs" :current-tab="currentTab" @navigated="navigated" />

    <div class="group-contacts-ctn">
      <ToolTip v-if="email" class="share-tip shadowed" placement="bottom" trigger="clickToOpen">
        <template #custom-content>
          <a :href="'mailto:' + email">
            {{ email }}
          </a>
        </template>
        <ExternalLabelButton
          :label="t('group.contact')"
          btn-icon="EmailOutline"
          vertical-layout
          label-on-hover
        />
      </ToolTip>
      <SocialShareButton :shared-url="sharedUrl" />
    </div>
  </NavPanelAside>
</template>

<script setup>
defineOptions({ name: 'GroupNavPanel' })

const props = defineProps({
  email: {
    type: String,
    default: '',
  },
  groupTabs: { type: Array, required: true },
  currentTab: {
    type: Object,
    default: () => {},
  },
  canEditGroup: {
    type: Boolean,
    default: false,
  },
  isEditing: {
    type: Boolean,
    default: false,
  },
})

const { t } = useNuxtI18n()
const emits = defineEmits(['navigated', 'toggle-editing'])
const sharedUrl = useRequestURL().toString()

const navigated = () => emits('navigated')
const switchView = () => emits('toggle-editing', !props.isEditing)
</script>

<style lang="scss" scoped>
.edit-btn-ctn {
  padding-bottom: 1rem;
  display: flex;
  justify-content: center;
}

.group-contacts-ctn {
  border: 1px solid $lighter-gray;
  border-radius: 1rem;
  padding: 1rem;
  display: flex;
  flex-flow: row;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 3rem;
}
</style>
