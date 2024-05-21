<template>
    <div class="templates-tab">
        <LpiSnackbar border icon="QuestionMark" type="info" class="snackbar">
            <div v-html="$t('template.info')"></div>
        </LpiSnackbar>

        <div class="form">
            <div class="block-container">
                <h4 class="title">{{ $t('template.category') }}</h4>
                <span class="description">{{ $t('template.tips-category') }}</span>
                <LpiSelect
                    v-model="selectedCategory.id"
                    :options="categoriesOptions"
                    @update:model-value="fillForm"
                    @blur="v$.selectedCategory.id.$touch"
                />
                <p
                    v-for="error of v$.selectedCategory.id.$errors"
                    :key="error.$uid"
                    class="error-description"
                >
                    {{ error.$message }}
                </p>
            </div>
            <FieldDisabler :disabled="otherFieldDisabled">
                <div class="block-container">
                    <div class="title-button-ctn">
                        <h4 class="title">{{ $t('template.tags') }}</h4>
                        <LpiButton
                            :label="$filters.capitalize($t('tag.edit'))"
                            @click="tagSearchIsOpened = true"
                        />
                    </div>

                    <div v-if="form.organizationTags.length" class="tag-grid">
                        <FilterValue
                            v-for="tag in form.organizationTags"
                            :key="tag.id"
                            :label="tag.name"
                            icon="Close"
                            @click="deleteOrganizationTag(tag)"
                        />
                    </div>

                    <br v-if="form.organizationTags.length && form.wikipediaTags.length" />

                    <div v-if="form.wikipediaTags.length" class="tag-grid">
                        <FilterValue
                            v-for="tag in form.wikipediaTags"
                            :key="tag.id"
                            :label="tag.name"
                            icon="Close"
                            @click="deleteWikipediaTag(tag)"
                        />
                    </div>

                    <span
                        v-if="!form.organizationTags.length && !form.wikipediaTags.length"
                        class="description"
                        >{{ $t('template.no-tag-set') }}</span
                    >
                </div>
            </FieldDisabler>

            <!-- TODO: delete or uncomment when we decide what to do about languages in categories -->
            <!-- <div class="block-container">
          <h4 class="title">{{ $t('template.language') }}</h4>
          <LpiSelect v-model="form.language" :options="languagesOptions" />
      </div> -->

            <div class="block-container template-container form">
                <h4 class="title">{{ $t('template.title') }}</h4>

                <FieldDisabler :disabled="otherFieldDisabled">
                    <TextInput v-model="form.title" :label="$t('template.placeholder-title')" />
                </FieldDisabler>

                <FieldDisabler :disabled="otherFieldDisabled">
                    <TextInput v-model="form.purpose" :label="$t('template.placeholder-purpose')" />
                </FieldDisabler>

                <FieldDisabler :disabled="otherFieldDisabled">
                    <label class="label">{{
                        $filters.capitalize($t('template.description'))
                    }}</label>
                    <TipTapEditor
                        :key="`description-${editorKey}`"
                        :selected-category="selectedCategory"
                        :ws-data="form.description"
                        mode="full"
                        @update="updateDescription"
                    />
                </FieldDisabler>

                <FieldDisabler :disabled="otherFieldDisabled">
                    <TextInput
                        v-model="form.blogTitle"
                        :label="$filters.capitalize($t('template.blog-title'))"
                    />
                </FieldDisabler>

                <FieldDisabler :disabled="otherFieldDisabled">
                    <label class="label">{{
                        $filters.capitalize($t('template.blog-content'))
                    }}</label>
                    <TipTapEditor
                        :key="`blog-${editorKey}`"
                        :selected-category="selectedCategory"
                        :ws-data="form.blogContent"
                        mode="full"
                        @update="updateBlogDescription"
                    />
                </FieldDisabler>

                <FieldDisabler :disabled="otherFieldDisabled">
                    <TextInput
                        v-model="form.goalTitle"
                        :label="$filters.capitalize($t('template.advancement-goal-title'))"
                    />
                </FieldDisabler>

                <FieldDisabler :disabled="otherFieldDisabled">
                    <label class="label">{{
                        $filters.capitalize($t('template.advancement-goal-content'))
                    }}</label>
                    <TipTapEditor
                        :key="`advancement-goal-${editorKey}`"
                        :save-icon-visible="false"
                        :selected-category="selectedCategory"
                        :ws-data="form.goal_description"
                        data-test="template-advancement-goal-content-editor"
                        mode="full"
                        @update="updateEditorAdvancementGoal"
                    />
                </FieldDisabler>

                <LpiButton
                    :disabled="otherFieldDisabled"
                    :label="$filters.capitalize($t('common.save'))"
                    :btn-icon="isLoading ? 'LoaderSimple' : null"
                    color="green"
                    @click="submit"
                />
            </div>
        </div>

        <BaseDrawer
            :confirm-action-name="$t('common.confirm')"
            :is-opened="tagSearchIsOpened"
            :title="$t('template.edit-tags')"
            class="small"
            @close="closeTags"
            @confirm="updateTemplateTags"
        >
            <TagsFilterEditor
                v-model="newTags"
                :ambiguous-tags-open="ambiguousTagsOpen"
                @ambiguous-menu="ambiguousTagsOpen = $event"
            />
        </BaseDrawer>
    </div>
</template>

<script>
import TextInput from '@/components/base/form/TextInput.vue'
import TipTapEditor from '@/components/base/form/TextEditor/TipTapEditor.vue'
import LpiSelect from '@/components/base/form/LpiSelect.vue'
import LpiButton from '@/components/base/button/LpiButton.vue'
import LpiSnackbar from '@/components/base/LpiSnackbar.vue'
import { getProjectCategory } from '@/api/project-categories.service'
import FieldDisabler from '@/components/base/form/FieldDisabler.vue'
import BaseDrawer from '@/components/base/BaseDrawer.vue'
import TagsFilterEditor from '@/components/search/Filters/TagsFilterEditor.vue'
import FilterValue from '@/components/search/Filters/FilterValue.vue'

import { useVuelidate } from '@vuelidate/core'
import { required, helpers } from '@vuelidate/validators'

export default {
    name: 'TemplatesTab',

    components: {
        TextInput,
        TipTapEditor,
        LpiSelect,
        LpiButton,
        LpiSnackbar,
        FieldDisabler,
        BaseDrawer,
        TagsFilterEditor,
        FilterValue,
    },

    setup() {
        return {
            v$: useVuelidate(),
        }
    },

    data() {
        return {
            form: {
                language: undefined,
                title: '',
                purpose: '',
                description: {
                    originalContent: '',
                    savedContent: '',
                },
                blogTitle: '',
                blogContent: {
                    originalContent: '',
                    savedContent: '',
                },
                goalTitle: '',
                goal_description: {
                    originalContent: '',
                    savedContent: '',
                },
                organizationTags: [],
                wikipediaTags: [],
            },
            isLoading: false,
            selectedCategory: { id: undefined },
            tagSearchIsOpened: false,
            editorKey: 0,
            newTags: [],
            ambiguousTagsOpen: false,
        }
    },

    validations() {
        return {
            selectedCategory: {
                id: {
                    required: helpers.withMessage(
                        this.$t('admin.form.template.category.required'),
                        required
                    ),
                },
            },
        }
    },

    async created() {
        await this.$store.dispatch('projectCategories/getAllProjectCategories')
    },

    computed: {
        // TODO: delete or uncomment when we decide what to do about languages in categories
        // languages() {
        //     return this.$store.getters['languages/all']
        // },

        // languagesOptions() {
        //     return this.languages.map((lang) => {
        //         return { value: lang, label: label: this.$t(`language.label-${lang}`)  }
        //     })
        // },

        categories() {
            return this.$store.getters['projectCategories/allOrderedByOrderId']
        },

        categoriesOptions() {
            return this.categories.map((category) => {
                return { value: category.id, label: category.name }
            })
        },

        otherFieldDisabled() {
            return !this.selectedCategory.id
        },

        allTags() {
            return [...(this.form || {}).organizationTags, ...(this.form || {}).wikipediaTags]
        },
    },

    methods: {
        async fillForm() {
            this.selectedCategory = await getProjectCategory(
                this.selectedCategory.id ? this.selectedCategory.id : this.categories[0].id
            )

            if (this.selectedCategory.template) {
                /* Titles and purpose */
                this.form.title = this.selectedCategory.template.title_placeholder
                this.form.purpose = this.selectedCategory.template.goal_placeholder
                this.form.description.originalContent =
                    this.selectedCategory.template.description_placeholder
                this.form.description.savedContent =
                    this.selectedCategory.template.description_placeholder

                /* Blog */
                this.form.blogTitle = this.selectedCategory.template.blogentry_title_placeholder
                this.form.blogContent.originalContent =
                    this.selectedCategory.template.blogentry_placeholder
                this.form.blogContent.savedContent =
                    this.selectedCategory.template.blogentry_placeholder

                /* Goal */
                this.form.goalTitle = this.selectedCategory.template.goal_title
                this.form.goal_description.originalContent =
                    this.selectedCategory.template.goal_description
                this.form.goal_description.savedContent =
                    this.selectedCategory.template.goal_description

                /* Language */
                this.form.language =
                    this.selectedCategory.lang || this.$store.state.languages.current

                /* Tags */
                this.form.organizationTags = this.selectedCategory.organization_tags
                this.form.wikipediaTags = this.selectedCategory.wikipedia_tags
            }
            this.editorKey += 1
        },

        async submit() {
            this.isLoading = true

            const template = {
                title_placeholder: this.form.title,
                goal_placeholder: this.form.purpose,
                description_placeholder: this.form.description.savedContent,
                blogentry_title_placeholder: this.form.blogTitle,
                blogentry_placeholder: this.form.blogContent.savedContent,
                goal_description: this.form.goal_description.savedContent,
                goal_title: this.form.goalTitle,
                // language: this.form.language, TODO: delete or uncomment when we decide what to do about languages in categories
            }

            const updatedData = {
                template: { ...template },
                organization_tags_ids: this.form.organizationTags.map((tag) => tag.id),
                wikipedia_tags_ids: this.form.wikipediaTags.map((tag) => tag.wikipedia_qid),
            }

            try {
                await this.$store.dispatch('projectCategories/updateProjectCategory', {
                    categoryId: this.selectedCategory.id,
                    newCategory: updatedData,
                })
                this.$store.dispatch('notifications/pushToast', {
                    message: this.$t('toasts.category-template-update.success'),
                    type: 'success',
                })
            } catch (error) {
                this.$store.dispatch('notifications/pushToast', {
                    message: `${this.$t('toasts.category-template-update.error')} (${error})`,
                    type: 'error',
                })
                console.error(error)
            } finally {
                this.isLoading = false
            }
        },

        updateDescription(htmlContent) {
            this.form.description.savedContent = htmlContent
        },

        updateBlogDescription(htmlContent) {
            this.form.blogContent.savedContent = htmlContent
        },

        updateEditorAdvancementGoal(htmlContent) {
            this.form.goal_description.savedContent = htmlContent
        },

        updateTemplateTags() {
            // memoize the newtags first
            const wikiTags = this.newTags.filter((tag) => tag.wikipedia_qid)
            const orgTags = this.newTags.filter((tag) => !tag.wikipedia_qid)
            // or form update will trigger watcher
            // that will reset newTags and then skip one or the other depending on watchers schedule
            this.form.organizationTags = orgTags
            this.form.wikipediaTags = wikiTags
            this.tagSearchIsOpened = false
        },

        closeTags() {
            this.newTags = [...this.form.organizationTags, ...this.form.wikipediaTags]
            this.tagSearchIsOpened = false
        },

        deleteWikipediaTag(tag) {
            this.form.wikipediaTags = this.form.wikipediaTags.filter((t) => t !== tag)
        },

        deleteOrganizationTag(tag) {
            this.form.organizationTags = this.form.organizationTags.filter((t) => t !== tag)
        },
    },
    watch: {
        allTags: {
            handler: function (neo) {
                this.newTags = [...neo]
            },
            immediate: true,
            deep: true,
        },
    },
}
</script>

<style lang="scss" scoped>
.templates-tab {
    .snackbar {
        margin: $space-l auto;
    }

    .error-description {
        color: $salmon-dark;
        margin-top: $space-s;
        font-size: $font-size-s;
    }

    .description {
        font-size: $font-size-m;
    }

    .title {
        font-size: $font-size-l;
    }

    .block-container {
        padding: $space-l 0;
        margin: $space-l 0;
        background: $white;
        border-radius: $border-radius-l;

        .title-button-ctn {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: $space-l;

            .title {
                margin: unset;
                font-size: $font-size-l;
            }
        }

        .tag-grid {
            display: flex;
            flex-wrap: wrap;
            gap: $space-s;
        }

        .label {
            font-size: $font-size-s;
            color: $primary-dark;
            font-weight: bold;
            display: block;
            margin-bottom: $space-m;
        }
    }
}
</style>
