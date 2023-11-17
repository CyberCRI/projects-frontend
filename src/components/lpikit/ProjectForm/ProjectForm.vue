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
            <div class="img-inner">
                <div class="img-preview">
                    <div class="preview-wrapper-outer">
                        <CroppedImage
                            :alt="`${form.title} image`"
                            :contain="true"
                            :image-sizes="form.imageSizes"
                            :src="displayedImage"
                            class="preview-wrapper-inner"
                        />
                    </div>
                </div>
                <div class="img-actions">
                    <LpiButton
                        v-disable-focus="otherFieldDisabled"
                        :label="$filters.capitalize($t('project.random-image'))"
                        :secondary="true"
                        class="next-patatoid-btn"
                        btn-icon="RotateRight"
                        @click="showNextPatatoid"
                        data-test="random-image-button"
                    />

                    <ImageInput
                        id="header_image"
                        :label="$t('project.form.upload-image')"
                        :unfocusable="otherFieldDisabled"
                        @upload-image="uploadImage"
                    />

                    <LpiButton
                        v-disable-focus="otherFieldDisabled"
                        :label="$t('project.form.resize-image')"
                        :secondary="true"
                        class="next-patatoid-btn"
                        btn-icon="Pen"
                        @click="openImageResizer"
                    />
                </div>
            </div>
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

        <DrawerLayout
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
        </DrawerLayout>

        <DrawerLayout
            :confirm-action-name="$t('common.confirm')"
            :is-opened="showImageResizer"
            :title="$t('project.form.resize-image')"
            class="medium"
            @close="showImageResizer = false"
            @confirm="saveImageSizes"
        >
            <ImageResizer
                v-if="showImageResizer"
                ref="imageResizer"
                :image="displayedImage"
                :image-sizes="form.imageSizes"
            />
        </DrawerLayout>
    </form>
</template>

<script>
import TextInput from '@/components/lpikit/TextInput/TextInput.vue'
import LpiSelect from '@/components/lpikit/LpiSelect/LpiSelect.vue'
import ImageInput from '@/components/lpikit/ImageInput/ImageInput.vue'
import TeamSection from './TeamSection.vue'
import LpiButton from '@/components/lpikit/LpiButton/LpiButton.vue'
import imageMixin from '@/mixins/imageMixin.ts'
import utils from '@/functs/functions.ts'
import FieldDisabler from './FieldDisabler.vue'
import TagsFilterSummary from '@/components/peopleKit/Filters/TagsFilterSummary.vue'
import TagsFilterEditor from '@/components/peopleKit/Filters/TagsFilterEditor.vue'
import IconImage from '@/components/svgs/IconImage.vue'
import DrawerLayout from '@/components/lpikit/Drawer/DrawerLayout.vue'
import ImageResizer from '@/components/lpikit/ImageResizer/ImageResizer.vue'
import CroppedImage from '@/components/lpikit/CroppedImage/CroppedImage.vue'

export default {
    name: 'ProjectForm',

    mixins: [imageMixin],

    emits: ['update:modelValue', 'close'],

    components: {
        TextInput,
        TeamSection,
        LpiSelect,
        ImageInput,
        LpiButton,
        FieldDisabler,
        TagsFilterEditor,
        IconImage,
        TagsFilterSummary,
        DrawerLayout,
        ImageResizer,
        CroppedImage,
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
        currentProject: {
            type: Object,
            default: null,
        },
        validation: {
            type: Object,
            default: () => {},
        },
    },

    data() {
        return {
            loading: false,
            displayedImage: '',
            currentPatatoidIndex: 1,
            selectedCategory: undefined,
            form: JSON.parse(JSON.stringify(this.modelValue)),
            ambiguousTagsOpen: false,
            tags: [...this.modelValue.organization_tags, ...this.modelValue.wikipedia_tags],
            tagSearchIsOpened: false,
            showImageResizer: false,
            tagsInProcess: [],
        }
    },

    async mounted() {
        if (this.isAddMode) {
            this.displayedImage = `${this.PUBLIC_BINARIES_PREFIX}/patatoids-project/Patatoid-${this.currentPatatoidIndex}.png`

            this.form.header_image = await utils.getPatatoidFile(this.currentPatatoidIndex)

            if (!this.categories.length) {
                await this.$store.dispatch('projectCategories/getAllProjectCategories')
            }
            // TODO check if we still preselect first category or not
            // this.form.category = this.categories[0].id

            if (this.$route.query.category) {
                this.form.category = parseInt(this.$route.query.category)
            }
        } else {
            this.displayedImage = this.currentProject.header_image
                ? this.currentProject.header_image.variations.small
                : null
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
        },

        saveTags() {
            this.tags = this.tagsInProcess
            this.tagSearchIsOpened = false
        },

        async showNextPatatoid() {
            if (this.currentPatatoidIndex !== 6) this.currentPatatoidIndex += 1
            else this.currentPatatoidIndex = 1

            this.form.header_image = await utils.getPatatoidFile(this.currentPatatoidIndex)
            this.displayedImage = `${this.PUBLIC_BINARIES_PREFIX}/patatoids-project/Patatoid-${this.currentPatatoidIndex}.png`
            // reinit image cropping data
            this.form.imageSizes = null
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
                if (user.user.keycloak_id) this.form.team[user.role].push(user.user.keycloak_id)
            })
        },

        uploadImage(image) {
            this.displayedImage = ''

            const fileReader = new FileReader()
            fileReader.readAsDataURL(image)

            fileReader.onload = (fileReaderEvent) => {
                this.displayedImage = fileReaderEvent.target.result
            }

            this.form.header_image = image
            // reinit image cropping data
            this.form.imageSizes = null
        },

        saveImageSizes() {
            this.form.imageSizes = {
                scaleX: this.$refs.imageResizer.scaleX,
                scaleY: this.$refs.imageResizer.scaleY,
                left: this.$refs.imageResizer.left,
                top: this.$refs.imageResizer.top,
                naturalRatio: this.$refs.imageResizer.naturalRatio,
            }
            this.showImageResizer = false
        },

        openImageResizer() {
            this.showImageResizer = true
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

        .img-inner {
            width: 100%;
            display: flex;
            gap: $space-m;

            .img-preview,
            .img-actions {
                flex-basis: 50%;
                flex-grow: 1;
            }

            .img-actions {
                display: flex;
                flex-flow: column;
                gap: $space-m;
                align-items: flex-start;
            }

            .img-preview {
                border-radius: $border-radius-m;
                border: $border-width-s solid $green;
                background-color: $white;
                overflow: hidden;
            }
        }

        .preview-wrapper-outer {
            width: 100%;
            padding-bottom: 100%;
            position: relative;
        }

        .preview-wrapper-inner {
            position: absolute;
            inset: 0;
        }
    }

    .error-description {
        color: $salmon-dark;
        margin-top: $space-s;
        font-family: Ubuntu, 'Noto Sans SC', helvetica, arial, sans-serif;
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
