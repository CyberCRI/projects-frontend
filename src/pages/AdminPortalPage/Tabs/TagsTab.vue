<template>
    <div class="tags-tab">
        <div class="block-container column-deskstop">
            <DefaultTagsAdmin />
            <DefaultSkillsAdmin />
        </div>

        <div class="block-container">
            <h2 class="title">{{ $t('admin.classifications.title') }}</h2>
            <p class="notice">{{ $t('admin.classifications.subtitle') }}</p>

            <div v-if="isLoadingOrgClassifications" class="loader">
                <LoaderSimple />
            </div>
            <div class="select-and-create" v-else>
                <div>
                    <p v-if="!orgClassifications.length">
                        {{ $t('admin.classifications.no-custom') }}
                    </p>

                    <LpiSelect
                        v-else-if="orgClassifications.length > 1"
                        v-model="selectedClassificationId"
                        :options="orgClassificationOptions"
                    />
                </div>
                <div>
                    <LpiButton
                        :label="$t('admin.classifications.create-classification')"
                        btn-icon="Plus"
                        @click="createClassificationIsOpen = true"
                    />
                </div>
            </div>
            <TagClassificationAdmin
                v-if="selectedClassification"
                :classification="selectedClassification"
                @classification-deleted="onClassificationDeleted"
                @classification-edited="onClassificationEdited"
                @classification-created="onClassificationCreated"
            />
        </div>
        <EditClassification
            :classification="null"
            :is-open="createClassificationIsOpen"
            @close="createClassificationIsOpen = false"
            @classification-edited="onClassificationEdited"
            @classification-created="onClassificationCreated"
        />
    </div>
</template>

<script>
import LpiButton from '@/components/base/button/LpiButton.vue'
import LpiSelect from '@/components/base/form/LpiSelect.vue'
import TagClassificationAdmin from '@/components/admin/TagClassificationAdmin.vue'
import useTagSearch from '@/composables/useTagSearch.js'
import EditClassification from '@/components/admin/EditClassification.vue'
import LoaderSimple from '@/components/base/loader/LoaderSimple.vue'
import DefaultTagsAdmin from '@/components/admin/DefaultTagsAdmin.vue'
import DefaultSkillsAdmin from '@/components/admin/DefaultSkillsAdmin.vue'
export default {
    name: 'TagsTab',

    components: {
        LpiButton,
        LpiSelect,
        TagClassificationAdmin,
        EditClassification,
        LoaderSimple,
        DefaultTagsAdmin,
        DefaultSkillsAdmin,
    },

    data() {
        return {
            confirmModalVisible: false,
            createClassificationIsOpen: false,

            ...useTagSearch({
                hideOrganizationTags: true,
                classificationType: 'custom',
            }),
        }
    },

    methods: {
        async onClassificationEdited() {
            await this.fetchAllClassifications()
        },
        async onClassificationCreated(classification) {
            await this.fetchAllClassifications()
            this.selectedClassificationId = classification.id
            this.createClassificationIsOpen = false
        },
        async onClassificationDeleted() {
            await this.fetchAllClassifications()
            this.selectedClassificationId = this.allOrgClassifications[0].id
        },
    },
}
</script>

<style lang="scss" scoped>
.block-container {
    padding: $space-l 0;
    margin: $space-l 0;
    background: $white;
    border-radius: $border-radius-l;
}

.select-and-create {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    margin-block: $space-l;
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

@media (min-width: $min-desktop) {
    .block-container {
        margin: $space-l 0;
    }

    .column-deskstop {
        display: flex;
        gap: $space-l;
    }
}
</style>
