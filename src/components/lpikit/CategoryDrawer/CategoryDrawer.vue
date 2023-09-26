<template>
    <Drawer
        :confirm-action-name="$t('common.save')"
        :is-opened="isOpened"
        :title="
            $filters.capitalize(
                addMode ? $t('admin.portal.categories.add') : $t('admin.portal.categories.edit')
            )
        "
        class="category-modal medium"
        @close="closeModal"
        @confirm="submitCategory"
        :asyncing="asyncing"
    >
        <div class="form">
            <div>
                <h4 class="title">{{ $t('form.category-name') }}</h4>
                <TextInput v-model="category.name" />
            </div>

            <div>
                <h4 class="title">{{ $t('form.description') }}</h4>
                <TipTapEditor :ws-data="category.description" @update="updateCategoryDescription" />
            </div>

            <div class="colors-ctn">
                <div class="color-block">
                    <h4 class="title">{{ $t('form.background-color') }}</h4>
                    <LpiSnackbar icon="QuestionMark" type="info">
                        <div v-html="$t('tips.background-color')"></div>
                    </LpiSnackbar>
                    <SketchPicker
                        v-model="category.background_color"
                        :preset-colors="[]"
                        data-test="category-background-color"
                    />
                </div>
            </div>

            <div class="image-preview-ctn">
                <h4 class="title">{{ $t('admin.portal.categories.preview-categories') }}</h4>
                <LpiSnackbar icon="QuestionMark" type="info">
                    <div v-html="$t('tips.category-image')"></div>
                </LpiSnackbar>
                <CategoryCardImage
                    v-if="!displayedImage"
                    :background-color="category.background_color || '#FFF'"
                    image-height="150px"
                    image-width="100%"
                />
                <div
                    v-else
                    :style="{
                        'background-image': `url(${displayedImage})`,
                    }"
                    class="category-image"
                ></div>
                <div class="category-preview">
                    <div v-if="category.name" class="category-preview-name">
                        {{ category.name }}
                    </div>
                </div>
                <ImageInput
                    id="category-image-input"
                    :existing-image="
                        category.background_image && category.background_image.variations
                            ? category.background_image.variations.small
                            : null
                    "
                    @upload-image="showNewImage"
                />
            </div>

            <div class="preview-block">
                <div class="page-preview">
                    <div class="text-container">
                        <p
                            :style="{
                                color: category.foreground_color.hex || 'black',
                            }"
                            class="page-preview-name"
                        >
                            {{ category.name }}
                        </p>
                        <p
                            class="page-preview-description"
                            v-html="category.description.originalContent"
                        />
                    </div>
                </div>
            </div>

            <div>
                <h4 class="title">{{ $t('admin.portal.categories.is-reviewable') }}</h4>
                <SwitchInput v-model="category.is_reviewable" />
            </div>

            <div>
                <h4 class="title">
                    {{ $t('admin.portal.categories.limit-publication-to-reviewers') }}
                </h4>
                <div class="description">{{ $t('tips.limit-publication-to-reviewers') }}</div>
                <SwitchInput v-model="category.only_reviewer_can_publish" />
            </div>

            <div v-if="!addMode">
                <h4 class="title">{{ $t('admin.portal.categories.delete-category') }}</h4>

                <LoaderSimple v-if="isFetchingProjects" />

                <div>
                    <LpiSnackbar
                        v-if="!isFetchingProjects && projectNb !== 0"
                        icon="QuestionMark"
                        type="info"
                    >
                        <div v-html="$t('tips.category-delete')"></div>
                    </LpiSnackbar>
                    <LpiButton
                        v-if="!isFetchingProjects && projectNb !== 0"
                        :label="
                            projectsVisible
                                ? $t('admin.portal.categories.hide-projects')
                                : `${$t('admin.portal.categories.display-projects')} (${projectNb})`
                        "
                        class="projects-btn"
                        @click="toggleProjectsVisible"
                    />
                    <ProjectListSearch
                        :search="{
                            limit: 12,
                            categories: category.id,
                        }"
                        :show-pagination="true"
                        :pagination-buttons-is-visible="projectsVisible"
                        mode="projects"
                        @pagination-changed="onPaginationChange"
                        @number-project="updateNumber"
                        @loading="toggleLoading"
                    >
                        <template #default="ProjectListSearchSlotProps">
                            <CardList
                                v-if="projectsVisible"
                                :desktop-columns-number="3"
                                :projects="ProjectListSearchSlotProps.projects"
                                :is-loading="isLoading"
                                class="project-list"
                            >
                                <template #projects="projectListSlotProps">
                                    <ProjectCard :project="projectListSlotProps.project" />
                                </template>
                            </CardList>
                        </template>
                    </ProjectListSearch>

                    <LpiButton
                        v-if="projectNb === 0"
                        :label="$t('admin.portal.categories.delete-category')"
                        @click="toggleConfirmDeleteModal"
                    />
                </div>
            </div>
        </div>

        <ConfirmModal
            v-if="confirmDeleteVisible"
            :content="$t('admin.portal.categories.delete-category-description')"
            :title="$t('admin.portal.categories.delete-category')"
            @cancel="toggleConfirmDeleteModal"
            @confirm="deleteCategory"
        />
    </Drawer>
</template>

<script>
import Drawer from '@/components/lpikit/Drawer/DrawerLayout.vue'
import TextInput from '@/components/lpikit/TextInput/TextInput.vue'
import TipTapEditor from '@/components/lpikit/TextEditor/TipTapEditor.vue'
import LpiSnackbar from '@/components/lpikit/Snackbar/LpiSnackbar.vue'
import ImageInput from '@/components/lpikit/ImageInput/ImageInput.vue'
import SwitchInput from '@/components/lpikit/SwitchInput/SwitchInput.vue'
import CategoryCardImage from '@/components/lpikit/CategoryCard/CategoryCardImage.vue'
import LpiButton from '@/components/lpikit/LpiButton/LpiButton.vue'
import CardList from '@/components/lpikit/ProjectList/CardList.vue'
import ProjectCard from '@/components/peopleKit/ProjectCard.vue'
import LoaderSimple from '@/components/lpikit/Loader/LoaderSimple.vue'
import ConfirmModal from '@/components/lpikit/ConfirmModal/ConfirmModal.vue'
import { Sketch } from '@ckpack/vue-color'
import ProjectListSearch from '@/components/lpikit/ProjectListSearch/ProjectListSearch.vue'

export default {
    name: 'CategoryDrawer',

    emits: ['close-modal', 'submit-category'],

    components: {
        Drawer,
        TextInput,
        TipTapEditor,
        LpiSnackbar,
        SketchPicker: Sketch,
        ImageInput,
        CategoryCardImage,
        SwitchInput,
        LpiButton,
        CardList,
        ProjectCard,
        LoaderSimple,
        ConfirmModal,
        ProjectListSearch,
    },

    props: {
        addMode: {
            type: Boolean,
            default: true,
        },

        editedCategory: {
            type: Object,
            default: null,
        },
        isOpened: {
            type: Boolean,
            default: false,
        },
    },

    data() {
        return {
            category: {
                name: '',
                description: {
                    originalContent: '',
                    savedContent: '',
                },
                background_color: '#81A617',
                foreground_color: '#FFFFFF',
                background_image: {
                    variations: {
                        small: undefined,
                    },
                },
                is_reviewable: true,
                only_reviewer_can_publish: false,
                organization_code: null,
            },
            confirmDeleteVisible: false,
            isFetchingProjects: true,
            projects: [],
            projectsVisible: false,
            displayedImage: null,
            asyncing: false,
            projectNb: 0,
            isLoading: false,
        }
    },

    watch: {
        'category.foreground_color': function (val) {
            if (typeof val !== String && val.hex) this.category.foreground_color = val.hex
        },

        'category.background_color': function (val) {
            if (typeof val !== String && val.hex) this.category.background_color = val.hex
        },
        'category.background_image': function (val) {
            this.displayedImage = val && val.variations ? val.variations.small : null
        },
    },

    async created() {
        if (!this.addMode) {
            // Fill form with edited category data
            this.category = {
                ...this.editedCategory,
                description: {
                    originalContent: this.editedCategory.description,
                    savedContent: '',
                },
            }
        }
        this.category.organization_code = this.organization.code
    },

    computed: {
        organization() {
            return this.$store.getters['organizations/current']
        },
    },

    methods: {
        onPaginationChange(pagination) {
            if (
                this.$route.query.page === pagination.currentPage ||
                (!this.$route.query.page && pagination.currentPage === 1)
            )
                return
            this.$router.push({
                path: this.$route.path,
                query: { ...this.$route.query, page: pagination.currentPage },
            })
        },

        closeModal() {
            this.$emit('close-modal')
        },

        toggleConfirmDeleteModal() {
            this.confirmDeleteVisible = !this.confirmDeleteVisible
        },

        async deleteCategory() {
            this.toggleConfirmDeleteModal()
            this.closeModal()
            await this.$store.dispatch('projectCategories/deleteProjectCategory', this.category.id)
        },

        showNewImage(image) {
            const newImage = image

            const fileReader = new FileReader()
            fileReader.readAsDataURL(newImage)

            fileReader.onload = (fileReaderEvent) => {
                this.displayedImage = fileReaderEvent.target.result
            }
            this.category.background_image = image
        },

        submitCategory() {
            this.asyncing = true
            this.$emit('submit-category', this.category)
        },

        toggleProjectsVisible() {
            this.projectsVisible = !this.projectsVisible
        },

        updateCategoryDescription(htmlContent) {
            this.category.description.savedContent = htmlContent
        },

        updateNumber(nb) {
            this.projectNb = nb
            this.isFetchingProjects = false
        },

        toggleLoading(loading) {
            this.isLoading = loading
        },
    },
}
</script>

<style lang="scss" scoped>
.category-modal {
    .colors-ctn {
        display: flex;
        align-items: center;

        .color-block {
            width: 50%;
            display: flex;
            flex-direction: column;
            align-items: center;

            &:first-of-type {
                margin-right: $space-s;
            }
        }
    }

    @media screen and (max-width: $min-tablet) {
        .colors-ctn {
            flex-direction: column;
            align-items: stretch;

            .color-block {
                width: 100%;

                &:first-of-type {
                    margin-bottom: $space-l;
                }
            }
        }
    }

    .snackbar {
        margin-bottom: $space-m;
    }

    .projects-btn {
        margin-bottom: $space-m;
    }

    .project-list {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
    }

    .category-preview {
        width: 100%;
        background-size: cover;
        background-position: 50%;
        border-radius: $border-radius-m;

        .category-preview-name {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-transform: uppercase;
            font-size: $font-size-m;
            font-weight: 700;
            display: inline-block;
            flex-direction: column;
            align-items: center;
            padding: $space-m;
            background: rgb(255 255 255 / 75%);
            border-radius: $border-radius-s;
        }
    }

    .preview-block {
        .page-preview {
            position: relative;
            border-radius: $border-radius-m;
            overflow: hidden;

            .text-container {
                position: absolute;
                top: 100px;
                left: 50px;
                background-size: cover;
                background-position: 50%;
            }
        }
    }

    .image-preview-ctn {
        position: relative;
    }
}

:deep(.input-ctn) {
    width: 100%;
}

:deep(.loader-simple) {
    margin: 0 auto;
}

:deep(.category-image) {
    width: 100%;
    max-width: 100%;
    height: 150px;
    border-radius: $border-radius-m;
    background-size: cover;
    background-position: center;
}
</style>
