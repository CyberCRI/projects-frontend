<script setup>
import { ref, computed, watch } from 'vue'
import FilterValue from '@/components/search/Filters/FilterValue.vue'
import TagsFilterEditor from '@/components/search/Filters/TagsFilterEditor.vue'
import BaseDrawer from '@/components/base/BaseDrawer.vue'
import LpiButton from '@/components/base/button/LpiButton.vue'
import ConfirmModal from '@/components/base/modal/ConfirmModal.vue'
import useToasterStore from '@/stores/useToaster.ts'
import useOrganizationsStore from '@/stores/useOrganizations.ts'
import useTagTexts from '@/composables/useTagTexts.js'

const { t } = useNuxtI18n()

const toaster = useToasterStore()
const organizationsStore = useOrganizationsStore()
const tagTexts = useTagTexts()

const newTags = ref([])

const tagSearchIsOpened = ref(false)
watch(tagSearchIsOpened, (value) => {
  if (value) {
    newTags.value = []
  }
})
const organizationTags = computed(() => {
  return organizationsStore.current?.default_projects_tags || []
})

const saveOrganizationTags = async () => {
  const newTagsIds = newTags.value.map((tag) => tag.id)
  const oldTagsIds = organizationTags.value.map((tag) => tag.id)

  try {
    await organizationsStore.updateCurrentOrganization({
      default_projects_tags: [...oldTagsIds, ...newTagsIds],
    })
    toaster.pushSuccess(t('toasts.organization-tag-create.success'))
    tagSearchIsOpened.value = false
  } catch (error) {
    toaster.pushError(`${t('toasts.organization-tag-create.error')} (${error})`)
    console.error(error)
  }
}

const closeTagsSelector = () => {
  tagSearchIsOpened.value = false
}

const tagToDelete = ref(null)
const asyncing = ref(false)
const deleteOrganizationTag = async () => {
  const tag = tagToDelete.value
  if (!tag) return
  try {
    asyncing.value = true
    await organizationsStore.updateCurrentOrganization({
      default_projects_tags: organizationTags.value.filter((t) => t.id != tag.id).map((t) => t.id),
    })
    toaster.pushSuccess(t('toasts.organization-tag-delete.success'))
  } catch (error) {
    toaster.pushError(`${t('toasts.organization-tag-delete.error')} (${error})`)
    console.error(error)
  } finally {
    asyncing.value = false
    tagToDelete.value = null
  }
}
</script>
<template>
  <div class="default-tag-admin">
    <h2 class="title">
      {{ t('admin.featured-tags.title') }}
    </h2>
    <p class="notice">
      {{ t('admin.featured-tags.notice') }}
    </p>

    <div class="tags-ctn">
      <FilterValue
        v-for="tag in organizationTags"
        :key="tag.id"
        data-test="default-tag"
        :label="tagTexts.title(tag)"
        icon="Close"
        @click="tagToDelete = tag"
      />
    </div>

    <div class="rel-ctn">
      <LpiButton
        data-test="add-default-tags"
        btn-icon="Plus"
        :label="t('common.add')"
        @click="tagSearchIsOpened = true"
      />
    </div>
    <BaseDrawer
      data-test="add-default-tags-drawer"
      :confirm-action-name="t('common.confirm')"
      :confirm-action-disabled="!newTags.length"
      :is-opened="tagSearchIsOpened"
      :title="t('tag.add-project-tag')"
      class="medium"
      @close="closeTagsSelector"
      @confirm="saveOrganizationTags"
    >
      <TagsFilterEditor
        v-model="newTags"
        :blocked-tags="organizationTags"
        hide-organization-tags
        :all-search-mode="false"
      />
    </BaseDrawer>
    <ConfirmModal
      v-if="tagToDelete"
      data-test="confirm-delete-default-tag"
      :title="$t('common.confirm-delete')"
      content=""
      cancel-button-label="common.no"
      confirm-button-label="common.yes"
      :asyncing="asyncing"
      @cancel="tagToDelete = null"
      @confirm="deleteOrganizationTag(tag)"
    />
  </div>
</template>
<style lang="scss" scoped>
.tags-ctn {
  display: flex;
  flex-wrap: wrap;
  gap: $space-m;
  margin-bottom: $space-l;
  margin-top: $space-l;
}

.title {
  text-transform: uppercase;
  font-weight: bold;
  color: $primary-dark;
  margin-bottom: $space-xl;
  font-size: $font-size-l;
}

.notice {
  margin-bottom: $space-l;
  font-size: $font-size-s;
}
</style>
