<script setup>
import { ref, computed } from 'vue'
import FilterValue from '@/components/search/Filters/FilterValue.vue'
import TagsFilterEditor from '@/components/search/Filters/TagsFilterEditor.vue'
import BaseDrawer from '@/components/base/BaseDrawer.vue'
import LpiButton from '@/components/base/button/LpiButton.vue'

import useToasterStore from '@/stores/useToaster.ts'
import useLanguagesStore from '@/stores/useLanguages'
import useOrganizationsStore from '@/stores/useOrganizations.ts'

import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const toaster = useToasterStore()
const languagesStore = useLanguagesStore()
const organizationsStore = useOrganizationsStore()

const newTags = ref([])

const tagSearchIsOpened = ref(false)

const tagLabel = (tag) => {
    return tag[`title_${languagesStore.current}`] || tag.title
}

const organizationTags = computed(() => {
    return organizationsStore.current.default_projects_tags
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

const deleteOrganizationTag = async (tag) => {
    try {
        await organizationsStore.updateCurrentOrganization({
            default_projects_tags: organizationTags.value
                .filter((t) => t.id != tag.id)
                .map((t) => t.id),
        })
        toaster.pushSuccess(t('toasts.organization-tag-delete.success'))
    } catch (error) {
        toaster.pushError(`{t('toasts.organization-tag-delete.error')} (${error})`)
        console.error(error)
    }
}
</script>
<template>
    <div class="default-tag-admin">
        <h2 class="title">{{ t('admin.featured-tags.title') }}</h2>
        <p class="notice">{{ t('admin.featured-tags.notice') }}</p>

        <div class="tags-ctn">
            <FilterValue
                v-for="tag in organizationTags"
                :key="tag.id"
                :label="tagLabel(tag)"
                icon="Close"
                @click="deleteOrganizationTag(tag)"
            />
        </div>

        <div class="rel-ctn">
            <div class="input-container">
                <LpiButton
                    btn-icon="Plus"
                    :label="t('common.add')"
                    @click="tagSearchIsOpened = true"
                />
            </div>
        </div>
        <BaseDrawer
            :confirm-action-name="t('common.confirm')"
            :is-opened="tagSearchIsOpened"
            :title="t('tag.add-wiki')"
            class="small"
            @close="closeTagsSelector"
            @confirm="saveOrganizationTags"
        >
            <TagsFilterEditor v-model="newTags" hide-organization-tags />
        </BaseDrawer>
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

.input-container {
    display: flex;
    align-items: center;
    flex-direction: column;
}

@media (min-width: $min-desktop) {
    .input-container {
        justify-content: center;
        flex-direction: row;
    }
}
</style>
