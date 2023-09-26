<template>
    <DialogModal class="category-modal" @close="closeModal" @submit="submitCategory">
        <template #header
            >{{
                $filters.capitalize(
                    addMode ? $t('admin.portal.categories.add') : $t('admin.portal.categories.edit')
                )
            }}
        </template>

        <template #body>
            <div class="form">
                <div>
                    <h4 class="title">{{ $t('form.category-name') }}</h4>
                    <TextInput v-model="category.name" />
                </div>

                <div>
                    <h4 class="title">{{ $t('form.description') }}</h4>
                    <TipTapEditor
                        :ws-data="category.description"
                        @update="updateCategoryDescription"
                    />
                </div>

                <div class="colors-ctn">
                    <div class="color-block">
                        <h4 class="title">{{ $t('form.text-color') }}</h4>
                        <LpiSnackbar icon="QuestionMark" type="info">
                            <div v-html="$t('tips.text-color')"></div>
                        </LpiSnackbar>
                        <SketchPicker
                            v-model="category.foreground_color"
                            :preset-colors="[]"
                            data-test="category-text-color"
                        />
                    </div>

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

                <div>
                    <h4 class="title">{{ $t('form.image') }}</h4>
                    <LpiSnackbar icon="QuestionMark" type="info">
                        <div v-html="$t('tips.category-image')"></div>
                    </LpiSnackbar>
                    <img
                        v-if="category.background_image"
                        :src="category.background_image.variations.small"
                        class="category-image"
                    />
                    <ImageInput
                        id="category-image-input"
                        :existing-image="
                            category.background_image
                                ? category.background_image.variations.small
                                : null
                        "
                        @upload-image="showNewImage"
                    />
                </div>

                <div class="preview-block">
                    <h4 class="title">{{ $t('admin.portal.categories.preview-categories') }}</h4>
                    <div :style="categoryPreviewStyle" class="category-preview">
                        <div v-if="category.name" class="category-preview-name">
                            {{ category.name }}
                        </div>
                    </div>
                </div>

                <div class="preview-block">
                    <h4 class="title">{{ $t('admin.portal.categories.preview-categories') }}</h4>
                    <div class="page-preview">
                        <CategoryCardImage
                            :background-color="category.background_color || '#000'"
                            :shapes-color="category.foreground_color || '#fff'"
                            image-height="200px"
                            image-width="100%"
                        />
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

                    <div v-else>
                        <div v-if="projects.length">
                            <LpiSnackbar icon="QuestionMark" type="info">
                                <div v-html="$t('tips.category-delete')"></div>
                            </LpiSnackbar>
                            <LpiButton
                                :label="
                                    projectsVisible
                                        ? $t('admin.portal.categories.hide-projects')
                                        : `${$t('admin.portal.categories.display-projects')} (${
                                              projects.length
                                          })`
                                "
                                class="projects-btn"
                                @click="toggleProjectsVisible"
                            />
                            <div v-if="projectsVisible">
                                <CardList :desktop-columns-number="2" :projects="projects">
                                    <template #default="projectListSlotProps">
                                        <ProjectCard :project="projectListSlotProps.project" />
                                    </template>
                                </CardList>
                            </div>
                        </div>

                        <LpiButton
                            v-else
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
        </template>

        <template #button-1
            ><span>{{ $t('common.cancel') }}</span></template
        >
        <template #button-2
            ><span>{{ $t('common.save') }}</span></template
        >
    </DialogModal>
</template>

<script>
import DialogModal from '@/components/lpikit/DialogModal/DialogModal.vue'
import TextInput from '@/components/lpikit/TextInput/TextInput.vue'
import TipTapEditor from '@/components/lpikit/TextEditor/TipTapEditor.vue'
import LpiSnackbar from '@/components/lpikit/Snackbar/LpiSnackbar.vue'
import ImageInput from '@/components/lpikit/ImageInput/ImageInput.vue'
import SwitchInput from '@/components/lpikit/SwitchInput/SwitchInput.vue'
import CategoryCardImage from '@/components/lpikit/CategoryCard/CategoryCardImage.vue'
import LpiButton from '@/components/lpikit/LpiButton/LpiButton.vue'
import CardList from '@/components/lpikit/ProjectList/CardList.vue'
import ProjectCard from '@/components/lpikit/ProjectCard/ProjectCard.vue'
import LoaderSimple from '@/components/lpikit/Loader/LoaderSimple.vue'
import ConfirmModal from '@/components/lpikit/ConfirmModal/ConfirmModal.vue'
import { Sketch } from '@ckpack/vue-color'

export default {
    name: 'CategoryModal',

    emits: ['close-modal', 'submit-category'],

    components: {
        DialogModal,
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
        }
    },

    watch: {
        'category.foreground_color': function (val) {
            if (typeof val !== String && val.hex) this.category.foreground_color = val.hex
        },

        'category.background_color': function (val) {
            if (typeof val !== String && val.hex) this.category.background_color = val.hex
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

            // Get projects belonging to this category
            const response = await this.$store.dispatch('projects/getAllProjects', {
                categories: this.category.id,
            })
            this.projects = response.results
            this.isFetchingProjects = false
        }
        this.category.organization_code = this.organization.code
    },

    computed: {
        categoryPreviewStyle() {
            return {
                backgroundColor:
                    this.category.background_color.hex || this.category.background_color,
                backgroundImage:
                    this.category.background_image &&
                    this.category.background_image.variations.small
                        ? `url(${this.category.background_image.variations.small})`
                        : null,
            }
        },

        organization() {
            return this.$store.getters['organizations/current']
        },
    },

    methods: {
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
                this.category.background_image.variations.small = fileReaderEvent.target.result
            }
        },

        submitCategory() {
            this.$emit('submit-category', this.category)
        },

        toggleProjectsVisible() {
            this.projectsVisible = !this.projectsVisible
        },

        updateCategoryDescription(htmlContent) {
            this.category.description.savedContent = htmlContent
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

    .category-image {
        width: 100%;
        max-width: 100%;
        border-radius: $border-radius-m;
    }

    .snackbar {
        margin-bottom: $space-m;
    }

    .projects-btn {
        margin-bottom: $space-m;
    }

    .preview-block {
        .category-preview {
            height: 150px;
            width: 100%;
            background-size: cover;
            background-position: 50%;
            border-radius: $border-radius-m;

            .category-preview-name {
                text-transform: uppercase;
                margin-top: 20px;
                margin-left: 20px;
                font-size: 16px;
                font-weight: 700;
                bottom: 0;
                color: $disabled;
                position: relative;
                background: $white;
                display: inline-block;
                padding: 10px 20px;
                box-shadow: 4px 4px 0 rgb(0 0 0 / 20%);
            }
        }

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
}
</style>

<style lang="scss">
.category-modal {
    .input-ctn {
        width: 100%;
    }

    .loader-simple {
        margin: 0 auto;
    }
}
</style>
