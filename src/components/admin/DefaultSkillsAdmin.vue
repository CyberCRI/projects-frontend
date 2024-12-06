<script setup>
import { ref, computed, watch } from 'vue'
import FilterValue from '@/components/search/Filters/FilterValue.vue'
import SkillsFilterEditor from '@/components/search/Filters/SkillsFilterEditor.vue'
import BaseDrawer from '@/components/base/BaseDrawer.vue'
import LpiButton from '@/components/base/button/LpiButton.vue'
import ConfirmModal from '@/components/base/modal/ConfirmModal.vue'
import useToasterStore from '@/stores/useToaster.ts'
import useOrganizationsStore from '@/stores/useOrganizations.ts'
import useTagTexts from '@/composables/useTagTexts.js'

import { useI18n } from 'vue-i18n'

const { t } = useI18n()

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
    return organizationsStore.current.default_skills_tags
})

const saveOrganizationTags = async () => {
    const newTagsIds = newTags.value.map((tag) => tag.id)
    const oldTagsIds = organizationTags.value.map((tag) => tag.id)

    try {
        await organizationsStore.updateCurrentOrganization({
            default_skills_tags: [...oldTagsIds, ...newTagsIds],
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
const deleteOrganizationTag = async () => {
    const tag = tagToDelete.value
    if (!tag) return
    try {
        await organizationsStore.updateCurrentOrganization({
            default_skills_tags: organizationTags.value
                .filter((t) => t.id != tag.id)
                .map((t) => t.id),
        })
        toaster.pushSuccess(t('toasts.organization-tag-delete.success'))
    } catch (error) {
        toaster.pushError(`{t('toasts.organization-tag-delete.error')} (${error})`)
        console.error(error)
    } finally {
        tagToDelete.value = null
    }
}
</script>
<template>
    <div class="default-tag-admin">
        <h2 class="title">{{ t('admin.featured-skills.title') }}</h2>
        <p class="notice">{{ t('admin.featured-skills.notice') }}</p>

        <div class="tags-ctn">
            <FilterValue
                data-test="default-skill"
                v-for="tag in organizationTags"
                :key="tag.id"
                :label="tagTexts.title(tag)"
                icon="Close"
                @click="tagToDelete = tag"
            />
        </div>

        <div class="rel-ctn">
            <LpiButton
                data-test="add-default-skills"
                btn-icon="Plus"
                :label="t('common.add')"
                @click="tagSearchIsOpened = true"
            />
        </div>
        <BaseDrawer
            data-test="add-default-skills-drawer"
            :confirm-action-name="t('common.confirm')"
            :confirm-action-disabled="!newTags.length"
            :is-opened="tagSearchIsOpened"
            :title="t('tag.add-profile-tag')"
            class="medium"
            @close="closeTagsSelector"
            @confirm="saveOrganizationTags"
        >
            <SkillsFilterEditor
                v-model="newTags"
                :blocked-skills="organizationTags"
                hide-organization-tags
                :all-search-mode="false"
            />
        </BaseDrawer>
        <ConfirmModal
            data-test="confirm-delete-default-skill"
            v-if="tagToDelete"
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
