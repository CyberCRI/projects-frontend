<template>
    <div class="tag-section">
        <label>
            <span class="section-title">
                {{ $t('tag.title') }}
                <span v-if="currentTags.length">({{ currentTags.length }})</span>
            </span>
            <span class="update-tags-btn" @click="openTagModal">
                <IconImage name="Plus" />
                <span>{{ $filters.capitalize($t('project.form.add-tags')) }}</span>
            </span>
        </label>

        <div class="hint-ctn">
            <p>{{ $t('project.form.link-your-project') }}</p>
            <p v-if="currentTags.length && isAddMode">{{ $t('project.form.some-tag-ideas') }}</p>
        </div>

        <div v-if="currentTags.length" class="current-tags">
            <div v-if="currentOrganizationTags.length">
                <FilterValue
                    v-for="tag in currentOrganizationTags"
                    :key="tag.id"
                    :label="tagLabel(tag)"
                    class="actionable"
                    icon="Close"
                    @click="removeTag(tag)"
                />
            </div>

            <br v-if="currentOrganizationTags.length && currentWikipediaTags.length" />

            <div v-if="currentWikipediaTags.length">
                <FilterValue
                    v-for="tag in currentWikipediaTags"
                    :key="tag.id"
                    :label="tagLabel(tag)"
                    class="actionable"
                    icon="Close"
                    @click="removeTag(tag)"
                />
            </div>
        </div>

        <p v-if="currentTags.length" class="delete-selection-ctn" @click="deleteCurrentTags">
            <IconImage name="Close" />
            <span>{{ $t('common.delete-selection') }}</span>
        </p>

        <DialogModal
            v-if="tagModal.visible"
            @close="tagModal.visible = false"
            @submit="tagModal.triggerUpdate = true"
        >
            <template #header>
                {{ $t('search.filter-by-tag') }}
            </template>

            <template #body>
                <FilterTags
                    :in-modal="true"
                    :preselection="currentTags"
                    :trigger-update="tagModal.triggerUpdate"
                    @update-filters="updateTags"
                />
            </template>

            <template #button-1>{{ $t('common.cancel') }}</template>
            <template #button-2>{{ $t('common.apply') }}</template>
        </DialogModal>
    </div>
</template>

<script>
import IconImage from '@/components/svgs/IconImage.vue'
import DialogModal from '@/components/lpikit/DialogModal/DialogModal.vue'
import FilterTags from '@/components/lpikit/FilterTags/FilterTags.vue'
import FilterValue from '@/components/peopleKit/Filters/FilterValue.vue'

export default {
    name: 'TagSection',

    emits: ['update-tags'],

    components: {
        FilterValue,
        IconImage,
        DialogModal,
        FilterTags,
    },

    async created() {
        await this.$store.dispatch('projectCategories/getAllProjectCategories')
        this.fillTags()
    },

    props: {
        isAddMode: {
            type: Boolean,
            default: true,
        },

        selectedCategory: {
            type: String,
            default: null,
        },

        selectedTags: {
            type: Array,
            default: () => [],
        },
    },

    computed: {
        currentOrganizationTags() {
            return this.currentTags.filter((currentTag) => currentTag.organization)
        },

        currentWikipediaTags() {
            return this.currentTags.filter((currentTag) => currentTag.wikipedia_qid)
        },

        getProjectCategoryById() {
            return this.$store.getters['projectCategories/getOneById']
        },

        projectCategory() {
            if (this.selectedCategory) return this.getProjectCategoryById(this.selectedCategory)
            return null
        },
    },

    data() {
        return {
            currentTags: [],
            tagModal: {
                visible: false,
                triggerUpdate: false,
            },
        }
    },

    methods: {
        fillTags() {
            if (this.isAddMode) {
                if (this.projectCategory) {
                    this.currentTags = [
                        ...this.projectCategory.wikipedia_tags,
                        ...this.projectCategory.organization_tags,
                    ]
                } else this.currentTags = []
            } else {
                this.currentTags = [...this.selectedTags]
            }

            this.$emit('update-tags', this.currentTags)
        },

        deleteCurrentTags() {
            this.currentTags = []
        },

        openTagModal() {
            this.tagModal.visible = true
        },

        updateTags(tags) {
            this.currentTags = tags
            this.tagModal.visible = false
            this.tagModal.triggerUpdate = false
            this.$emit('update-tags', this.currentTags)
        },

        tagLabel(tag) {
            return tag[`name_${this.$store.getters['languages/current']}`] || tag.name
        },

        removeTag(tag) {
            const tagIndex = this.currentTags.findIndex(
                (element) => element.id === tag.id && element.name === tag.name
            )
            this.currentTags.splice(tagIndex, 1)
        },
    },

    watch: {
        selectedCategory: function () {
            this.fillTags()
        },
    },
}
</script>

<style lang="scss" scoped>
.tag-section {
    label {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        flex-direction: column;
        width: 100%;
    }

    .update-tags-btn {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        background: $white;
        color: $primary-dark;
        cursor: pointer;
        font-weight: 700;
        margin-top: $space-s;
        margin-left: pxToRem(-3px);

        svg {
            width: 18px;
            fill: $primary-dark;
        }
    }

    .hint-ctn {
        margin: $space-m 0;
    }

    .current-tags {
        border-radius: $border-radius-l;
        padding: $space-l 0;

        > div {
            display: flex;
            flex-wrap: wrap;
            gap: $space-s;
        }
    }

    .delete-selection-ctn {
        text-align: center;
        text-transform: uppercase;
        font-size: $font-size-2xs;
        font-weight: 700;
        color: $primary-dark;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: $space-s;
        cursor: pointer;

        svg {
            margin-right: $space-xs;
            fill: $primary-dark;
            width: 7px;
        }
    }
}
</style>
