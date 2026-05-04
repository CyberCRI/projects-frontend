<template>
  <AdminBlock :block-title="$t('admin.portal.general.wording.title')" :is-loading="false">
    <template #actions>
      <LinkButton btn-icon="Pen" :label="$t('common.edit')" @click="drawerIsOpen = true" />
    </template>
    <template #default>
      <p class="notice">
        {{ $t('admin.portal.general.wording.notice') }}
      </p>

      <div class="sub-container">
        <h5 class="sub-title">
          {{ $t('admin.portal.general.wording.fields.title') }}
        </h5>
        <p class="sub-field">
          {{ title }}
        </p>
      </div>
      <div class="sub-container">
        <h5 class="sub-title">
          {{ $t('admin.portal.general.wording.fields.description') }}
        </h5>
        <p class="sub-field">
          {{ description }}
        </p>
      </div>
    </template>
  </AdminBlock>
  <OrgWordingDrawer
    :is-opened="drawerIsOpen"
    @close="drawerIsOpen = false"
    @organization-edited="reloadOrganization"
  />
</template>

<script setup lang="ts">
import OrgWordingDrawer from '~/components/admin/GeneralAdminBlocks/Wording/OrgWordingDrawer.vue'
import LinkButton from '~/components/base/button/LinkButton.vue'

import useOrganizationsStore from '~/stores/useOrganizations'

import { cropIfTooLong, html2Text } from '~/functs/string'
import AdminBlock from '../AdminBlock.vue'

const organizationsStore = useOrganizationsStore()
const drawerIsOpen = ref(false)
const { t } = useNuxtI18n()

const organization = computed(() => organizationsStore.current)

const title = computed(() => {
  return (
    organization.value?.$t.dashboard_title ||
    t('admin.portal.general.wording.fields.title-placeholder')
  )
})
const description = computed(() => {
  if (organization.value?.$t.description) {
    return cropIfTooLong(html2Text(organization.value.$t.description), 255)
  }
  return t('admin.portal.general.wording.fields.description-placeholder')
})

const reloadOrganization = () => {
  organizationsStore.getCurrentOrganization(organization.value?.code)
}
</script>
<style lang="scss" scoped>
.sub-container {
  position: relative;
  padding: $space-m 0;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 6rem;
    height: 1px;
    border-bottom: $border-width-s solid $lighter-gray;
  }

  .sub-title,
  .sub-field {
    font-size: $font-size-m;
    color: $black;
    font-weight: normal;
    margin: $space-m 0;
  }
}
</style>
