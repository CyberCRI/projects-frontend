<template>
    <form>
        <!--  Category -->
        <div v-if="isAddMode && categoryOptions && categoryOptions.length" class="category-ctn">
            <label class="label">{{ $t('project.form.project-category') }} *</label>
            <LpiSelect
                v-model="form.category"
                :value="form.category"
                :options="categoryOptions"
                class="category-select"
                data-test="select-project-category"
            />
        </div>

        <!--  Title -->
        <FieldDisabler :disabled="otherFieldDisabled">
            <TextInput
                v-model="form.title"
                :placeholder="titlePlaceholder"
                :unfocusable="otherFieldDisabled"
                space-below-label="large-space"
                @blur="validation.form.title.$touch"
                data-test="title-input"
            >
                <label>{{
                    isAddMode
                        ? `${$t('project.form.title-label')} *`
                        : `${$t('project.form.edit-title')} *`
                }}</label>
            </TextInput>
            <p
                v-for="error of validation.form.title.$errors"
                :key="error.$uid"
                class="error-description"
            >
                {{ error.$message }}
            </p>
        </FieldDisabler>

        <!-- Purpose -->
        <FieldDisabler :disabled="otherFieldDisabled" class="purpose-input">
            <TextInput
                v-model="form.purpose"
                :placeholder="purposePlaceholder"
                :unfocusable="otherFieldDisabled"
                data-test="purpose-input"
                @blur="validation.form.purpose.$touch"
                space-below-label="large-space"
                ><label>{{ $t('project.form.purpose-label') + ' *' }}</label>
            </TextInput>
            <p
                v-for="error of validation.form.purpose.$errors"
                :key="error.$uid"
                class="error-description"
            >
                {{ error.$message }}
            </p>
        </FieldDisabler>

        <!-- Team -->
        <FieldDisabler v-if="isAddMode" :disabled="otherFieldDisabled" class="team">
            <TeamSection
                :selected-category="selectedCategory"
                :unfocusable="otherFieldDisabled"
                @update-team="updateTeam"
            />
        </FieldDisabler>

        <!-- Tag -->
        <FieldDisabler :disabled="otherFieldDisabled" class="tags">
            <label>
                {{ $filters.capitalize($t('tag.title')) }}
                <span
                    v-disable-focus="otherFieldDisabled"
                    class="add-tags"
                    @click="tagSearchIsOpened = true"
                    data-test="tags"
                >
                    <IconImage name="Plus" />
                    <span>{{ $filters.capitalize($t('project.form.add-tags')) }}</span>
                </span>
            </label>
            <TagsFilterSummary v-model="tags" />
        </FieldDisabler>

        <div class="spacer"></div>

        <!-- Picture -->
        <FieldDisabler :disabled="otherFieldDisabled" class="img-ctn">
            <label>{{ $filters.capitalize($t('project.image-header')) }}</label>
            <ImageEditor
                :picture-alt="`${form.last_name} image`"
                :contain="true"
                v-model:imageSizes="form.imageSizes"
                v-model:picture="form.header_image"
                :default-picture="defaultPictures"
                :disabled="otherFieldDisabled"
            ></ImageEditor>
        </FieldDisabler>

        <!-- Language -->
        <FieldDisabler :disabled="otherFieldDisabled" class="language">
            <label>{{ $filters.capitalize($t('project.language')) }}</label>
            <LpiSelect
                v-model="form.language"
                :value="form.language"
                :options="languageOptions"
                class="category-select"
                data-test="select-language"
            />
        </FieldDisabler>

        <BaseDrawer
            :confirm-action-name="$t('common.confirm')"
            :is-opened="tagSearchIsOpened"
            :title="$t('project.form.add-tags')"
            class="small"
            @close="closeTagSearchTags"
            @confirm="saveTags"
        >
            <TagsFilterEditor
                v-model="tags"
                :value="tags"
                :ambiguous-tags-open="ambiguousTagsOpen"
                :hide-organization-tags="false"
                :progressive-update="false"
                @ambiguous-menu="ambiguousTagsOpen = $event"
                @update-tags="updateTagsInProcess"
            />
        </BaseDrawer>
    </form>
</template>

<script>
import TextInput from '@/components/base/form/TextInput.vue'
import LpiSelect from '@/components/base/form/LpiSelect.vue'
import TeamSection from './TeamSection.vue'
import imageMixin from '@/mixins/imageMixin.ts'
import FieldDisabler from './FieldDisabler.vue'
import TagsFilterSummary from '@/components/lpikit/Filters/TagsFilterSummary.vue'
import TagsFilterEditor from '@/components/lpikit/Filters/TagsFilterEditor.vue'
import IconImage from '@/components/base/media/IconImage.vue'
import BaseDrawer from '@/components/base/BaseDrawer.vue'
import ImageEditor from '@/components/base/form/ImageEditor.vue'

export default {
    name: 'ProjectForm',

    mixins: [imageMixin],

    emits: ['update:modelValue', 'close'],

    components: {
        TextInput,
        TeamSection,
        LpiSelect,
        FieldDisabler,
        TagsFilterEditor,
        IconImage,
        TagsFilterSummary,
        BaseDrawer,
        ImageEditor,
    },

    props: {
        isAddMode: {
            type: Boolean,
            default: true,
        },
        modelValue: {
            type: Object,
            required: true,
        },
        validation: {
            type: Object,
            default: () => {},
        },
    },

    data() {
        const defaultPictures = [1, 2, 3, 4, 5, 6].map((index) => {
            return `${
                import.meta.env.VITE_APP_PUBLIC_BINARIES_PREFIX
            }/patatoids-project/Patatoid-${index}.png`
        })

        return {
            loading: false,
            displayedImage: '',
            selectedCategory: undefined,
            form: JSON.parse(JSON.stringify(this.modelValue)),
            ambiguousTagsOpen: false,
            tags: [...this.modelValue.organization_tags, ...this.modelValue.wikipedia_tags],
            tagSearchIsOpened: false,
            showImageResizer: false,
            tagsInProcess: [],
            defaultPictures,
        }
    },

    async mounted() {
        if (this.isAddMode) {
            if (!this.categories.length) {
                await this.$store.dispatch('projectCategories/getAllProjectCategories')
            }
            // TODO check if we still preselect first category or not
            // this.form.category = this.categories[0].id

            if (this.$route.query.category) {
                this.form.category = parseInt(this.$route.query.category)
            }
        }
    },

    computed: {
        categories() {
            return this.$store.getters['projectCategories/allOrderedByOrderId']
        },

        categoryOptions() {
            return this.categories.map((category) => {
                return {
                    value: category.id,
                    label: category.name,
                    dataTest: `project-form-${category.id}`,
                }
            })
        },

        languageOptions() {
            return this.$store.getters['languages/all'].map((language) => {
                return {
                    value: language,
                    label: this.$t(`language.label-${language}`),
                    dataTest: `project-form-${language}`,
                }
            })
        },

        titlePlaceholder() {
            if (
                this.selectedCategory &&
                this.selectedCategory.template &&
                this.selectedCategory.template.title_placeholder
            )
                return this.selectedCategory.template.title_placeholder
            return this.$t('project.form.title-placeholder')
        },

        purposePlaceholder() {
            if (
                this.selectedCategory &&
                this.selectedCategory.template &&
                this.selectedCategory.template.goal_placeholder
            )
                return this.selectedCategory.template.goal_placeholder
            return this.$t('project.form.purpose-placeholder')
        },

        otherFieldDisabled() {
            return (
                this.isAddMode &&
                !!this.categoryOptions &&
                this.categoryOptions.length > 0 &&
                !this.form.category
            )
        },
    },

    watch: {
        'form.category': async function (categoryId, oldVal) {
            if (categoryId && categoryId !== oldVal)
                this.selectedCategory = this.categories.find(
                    (category) => category.id === categoryId
                )
            // set default tags according to selected category
            this.tags = [
                ...this.selectedCategory.organization_tags,
                ...this.selectedCategory.wikipedia_tags,
            ]
        },

        form: {
            deep: true,
            handler: function () {
                this.$emit('update:modelValue', this.form)
            },
        },

        tags: {
            handler() {
                this.updateTags()
            },
            deep: true,
        },
    },

    methods: {
        closeTagSearchTags() {
            this.tagSearchIsOpened = false
            this.ambiguousTagsOpen = false
        },

        saveTags() {
            this.tags = this.tagsInProcess
            this.tagSearchIsOpened = false
        },

        updateTags() {
            this.form.organization_tags = this.tags.filter((tag) => tag.organization)

            this.form.wikipedia_tags = this.tags.filter((tag) => tag.wikipedia_qid)
        },

        updateTeam(team) {
            this.form.team.members = []
            this.form.team.owners = []
            this.form.team.reviewers = []

            team.forEach((user) => {
                /* This condition let us skip the first user (connected user) */
                if (this.$filters.isNotGroup(user.user))
                    this.form.team[user.role].push(user.user.id)
            })
        },

        updateTagsInProcess(tags) {
            this.tagsInProcess = tags
        },
    },
}
</script>

<style lang="scss" scoped>
.project-form {
    .purpose-input {
        margin: $space-xl 0;
    }

    .category-ctn {
        margin-bottom: $space-xl;
    }

    .category-select {
        width: 100%;

        select {
            width: 100%;
        }
    }

    .team,
    .tags {
        margin-bottom: $space-xl;
    }

    .completed-form-snackbar {
        width: fit-content;
        margin: $space-xl auto;
        border: $border-width-s solid $salmon-dark;
    }

    .language {
        margin-bottom: $space-xl;
    }

    .img-ctn {
        margin-bottom: $space-xl;
        display: flex;
        flex-direction: column;
        align-items: center;

        label {
            align-self: flex-start;
        }
    }

    .error-description {
        color: $salmon-dark;
        margin-top: $space-s;
        font-size: $font-size-s;
    }

    .tags label {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-direction: row;
        width: 100%;
        margin-bottom: $space-l;

        .section-title {
            font-size: $font-size-s;
            color: $black;
            font-weight: bold;
            display: block;
        }

        .add-tags {
            display: inline-flex;
            justify-content: center;
            align-items: center;
            background: $white;
            color: $primary-dark;
            cursor: pointer;
            font-weight: 700;

            svg {
                width: 18px;
                fill: $primary-dark;
            }
        }
    }

    label {
        margin-bottom: $space-l;
        font-size: $font-size-m;
        color: $black;
        font-weight: bold;
        display: block;
    }

    .spacer {
        border-top: 1px solid $gray-10;
        margin-bottom: 34px;
    }
}
</style>
