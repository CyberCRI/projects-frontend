<template>
    <div :class="{ inline }" class="tags-filter-editor">
        <div class="section">
            <CurrentTags :current-tags="tags" class="current-tags" @remove-tag="removeTag" />
        </div>

        <div class="section">
            <p class="notice">{{ $t('search.current-classification-description') }}</p>

            <LpiSelect v-model="selectedClassificatonId" :options="orgClassificationOptions" />
        </div>

        <div v-if="suggestedTags.length" class="section">
            <SuggestedTags
                :current-tags="tags"
                :suggested-tags="suggestedTags"
                @add-tag="addTag"
                :loading="suggestedTagsisLoading"
            />
        </div>

        <div v-show="showTagSearch" class="section">
            <p class="notice">{{ $t('search.current-tag-description') }}</p>

            <FilterSearchInput
                ref="search-input-component"
                v-model.trim="search"
                :placeholder="$t('search.search-tag')"
                class="search-input-ctn"
            />

            <TagResults
                v-if="search"
                :classification-id="selectedClassificatonId"
                :existing-tags="tags"
                :inline="inline"
                :search="search"
                @add-tag="onAddTag"
                @go-back="goBackToAddMode"
            />
        </div>

        <template> </template>
    </div>
</template>

<script>
import FilterSearchInput from '@/components/search/Filters/FilterSearchInput.vue'
import CurrentTags from '@/components/search/FilterTags/CurrentTags.vue'
import SuggestedTags from '@/components/search/FilterTags/SuggestedTags.vue'
import TagResults from '@/components/search/FilterTags/TagResults.vue'
import LpiSelect from '@/components/base/form/LpiSelect.vue'
import useTagSearch from '@/composables/useTagSearch.js'
export default {
    name: 'TagsFilterEditor',

    emits: ['update:modelValue', 'update-tags'],

    components: {
        FilterSearchInput,
        CurrentTags,
        SuggestedTags,
        TagResults,
        LpiSelect,
    },

    props: {
        modelValue: {
            type: Array,
            default: () => [],
        },
        triggerUpdate: {
            type: Boolean,
            default: false,
        },

        hideOrganizationTags: {
            type: Boolean,
            default: false,
        },
        inline: {
            type: Boolean,
            default: false,
        },
        progressiveUpdate: {
            type: Boolean,
            default: true,
        },
    },
    setup(props) {
        return {
            ...useTagSearch(props.hideOrganizationTags),
        }
    },

    data() {
        return {
            tags: [],
        }
    },

    mounted() {
        this.focusInput()
    },

    methods: {
        addTag(tag) {
            this.tags.push(tag)
            if (this.progressiveUpdate) {
                this.$emit('update:modelValue', this.tags)
            } else {
                this.$emit('update-tags', this.tags)
            }
        },

        focusInput() {
            const searchInput = this.$refs['search-input-component']?.$refs['search-input']
            if (searchInput)
                this.$nextTick(() => {
                    searchInput.focus()
                })
        },

        goBackToAddMode() {
            this.search = ''
            this.focusInput()
        },

        onAddTag(result) {
            this.addTag(result)
            this.search = ''
            this.focusInput()
        },

        removeTag(tag) {
            const tagIndex = this.tags.findIndex(
                (element) => element.id === tag.id && element.name === tag.name
            )
            this.tags.splice(tagIndex, 1)
            if (this.progressiveUpdate) {
                this.$emit('update:modelValue', this.tags)
            } else {
                this.$emit('update-tags', this.tags)
            }
        },
    },

    watch: {
        queryString(val) {
            if (val.length >= 3) {
                this.focusInput()
            }
        },

        triggerUpdate: function () {
            this.$emit('update:modelValue', this.tags)
        },

        modelValue: {
            handler: function (neo) {
                this.tags = [...neo]
            },
            immediate: true,
            deep: true,
        },
    },
}
</script>

<style lang="scss" scoped>
.section {
    margin-bottom: $space-m;
}

.notice {
    font-size: $font-size-s;
    margin-bottom: $space-s;
}

.current-tags {
    margin-top: pxToRem(16px);
}

.tag-search-title {
    text-align: center;
    font-size: $font-size-2xl;
    font-weight: 700;
    margin: pxToRem(46px) auto;
}

.input-ctn {
    width: 100%;

    label {
        align-self: flex-start;
    }

    input {
        width: 100%;
    }
}

.add-modal .s-modal-wrapper .s-modal-content {
    max-height: 526px;
}

.search-modal .s-modal-wrapper .s-modal-content {
    max-height: 660px;
}

.tag-search-label {
    font-size: $font-size-m;
    color: $primary-dark;
    font-weight: 700;
    margin: 0 0 $space-s $space-l;
}

.lpi-select {
    width: 100%;
}
</style>
