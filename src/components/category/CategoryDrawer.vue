<template>
    <Drawer
        :confirm-action-name="$t('common.save')"
        :is-opened="isOpened"
        :title="
            $filters.capitalize(
                !category?.id
                    ? $t('admin.portal.categories.add')
                    : $t('admin.portal.categories.edit')
            )
        "
        class="category-modal small"
        @close="closeModal"
        @confirm="submitCategory"
        :asyncing="asyncing"
    >
        <div class="category-form">
            <CategoryField :label="$t('form.category-name')">
                <TextInput v-model="category.name" />
            </CategoryField>

            <CategoryField :label="$t('form.description')">
                <p class="notice">{{ $t('admin.portal.categories.description-limit') }}</p>

                <TipTapEditor :ws-data="category.description" @update="updateCategoryDescription" />
            </CategoryField>

            <p class="pre-field-notice">{{ $t('admin.portal.categories.background-notice') }}</p>

            <CategoryField :label="$t('admin.portal.categories.background-color')" is-toggleable>
                <div class="field-tip">
                    <div v-html="$t('tips.background-color')"></div>
                </div>
                <SketchPicker
                    v-model="category.background_color"
                    :preset-colors="[]"
                    data-test="category-background-color"
                />
            </CategoryField>

            <CategoryField
                class="image-preview-ctn"
                :label="$t('admin.portal.categories.background-image')"
                is-toggleable
            >
                <div class="field-tip">
                    <div v-html="$t('admin.portal.categories.tips-background-image')"></div>
                </div>

                <ImageInput
                    id="category-image-input"
                    :label="$t('admin.portal.categories.upload-picture')"
                    :existing-image="
                        category.background_image && category.background_image.variations
                            ? category.background_image.variations.small
                            : null
                    "
                    @upload-image="showNewImage"
                />
            </CategoryField>

            <CategoryField
                class="image-preview-ctn"
                :label="$t('admin.portal.categories.preview-categories')"
            >
                <div class="category-previewer">
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
                </div>
            </CategoryField>

            <!--div class="preview-block">
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
            </div-->

            <CategoryField :label="$t('admin.portal.categories.children')">
                <p class="no-child" v-if="!category.children.length">
                    {{ $t('admin.portal.categories.no-child') }}
                </p>
                <Sortable
                    v-else
                    :list="category.children"
                    :options="dragOptions"
                    group="category-children"
                    @end="onReorder"
                    tag="transition-group"
                    item-key="id"
                    :component-data="{
                        tag: 'ul',
                        type: 'transition-group',
                        name: !drag ? 'flip-list' : null,
                    }"
                >
                    <template #item="{ element: child }">
                        <li class="category-child" :key="child.id" :data-category-id="child.id">
                            <span class="drag-icon">
                                <IconImage name="DotsGrid" />
                            </span>
                            <div class="child-name">
                                {{ child.name }}
                            </div>
                        </li>
                    </template>
                </Sortable>
            </CategoryField>

            <CategoryField :label="$t('admin.portal.categories.authorizations')">
                <div class="radio-group">
                    <RadioButton
                        v-model="category.is_reviewable"
                        :value="true"
                        :label="$t('common.no')"
                        radio-group="is_reviewable"
                        as-button
                    />
                    <RadioButton
                        v-model="category.is_reviewable"
                        :value="false"
                        :label="$t('common.yes')"
                        radio-group="is_reviewable"
                        as-button
                    />
                    <h4 class="radio-group-title">
                        {{ $t('admin.portal.categories.is-reviewable') }}
                    </h4>
                </div>

                <div class="radio-group">
                    <RadioButton
                        v-model="category.only_reviewer_can_publish"
                        :value="true"
                        :label="$t('common.no')"
                        radio-group="only_reviewer_can_publish"
                        as-button
                    />
                    <RadioButton
                        v-model="category.only_reviewer_can_publish"
                        :value="false"
                        :label="$t('common.yes')"
                        radio-group="only_reviewer_can_publish"
                        as-button
                    />
                    <h4 class="radio-group-title">
                        {{ $t('admin.portal.categories.limit-publication-to-reviewers') }}
                    </h4>
                </div>
            </CategoryField>
        </div>
    </Drawer>
</template>

<script>
import Drawer from '@/components/base/BaseDrawer.vue'
import TextInput from '@/components/base/form/TextInput.vue'
import TipTapEditor from '@/components/base/form/TextEditor/TipTapEditor.vue'
import ImageInput from '@/components/base/form/ImageInput.vue'
import CategoryCardImage from '@/components/category/CategoryCardImage.vue'
import { Sketch } from '@ckpack/vue-color'
import CategoryField from '@/components/category/CategoryField.vue'
import RadioButton from '@/components/base/form/RadioButton.vue'
import IconImage from '@/components/base/media/IconImage.vue'
import { Sortable } from 'sortablejs-vue3'

export function defaultForm() {
    return {
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
        children: [],
        order_index: 0,
    }
}

export default {
    name: 'CategoryDrawer',

    emits: ['close-modal', 'submit-category'],

    components: {
        Drawer,
        TextInput,
        TipTapEditor,
        SketchPicker: Sketch,
        ImageInput,
        CategoryCardImage,
        CategoryField,
        RadioButton,
        IconImage,
        Sortable,
    },

    props: {
        editedCategory: {
            type: Object,
            default: null,
        },
        parentCategory: {
            type: Number,
            default: null,
        },
        isOpened: {
            type: Boolean,
            default: false,
        },
    },

    data() {
        return {
            category: defaultForm(),
            projects: [],
            displayedImage: null,
            asyncing: false,
        }
    },
    computed: {
        organization() {
            return this.$store.getters['organizations/current']
        },
        dragOptions() {
            return {
                animation: 200,
                group: 'category-children',
                disabled: false,
                ghostClass: 'child-ghost',
            }
        },
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
        if (this.editedCategory) {
            // Fill form with edited category data
            this.category = {
                ...this.editedCategory,
                description: {
                    originalContent: this.editedCategory.description,
                    savedContent: '',
                },
            }
        } else {
            this.category = { ...defaultForm(), parent: this.parentCategory }
        }
        this.category.organization_code = this.organization.code
    },

    methods: {
        onReorder(event) {
            const { newIndex, oldIndex } = event
            const movedChild = this.category.children[oldIndex]
            this.category.children.splice(oldIndex, 1)
            this.category.children.splice(newIndex, 0, movedChild)
        },

        closeModal() {
            this.$emit('close-modal')
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

        updateCategoryDescription(htmlContent) {
            this.category.description.savedContent = htmlContent
        },
    },
}
</script>

<style lang="scss" scoped>
.category-modal {
    .color-block {
        width: 50%;
        display: flex;
        flex-direction: column;
        align-items: center;

        &:first-of-type {
            margin-right: $space-s;
        }
    }

    @media screen and (max-width: $min-tablet) {
        .color-block {
            width: 100%;

            &:first-of-type {
                margin-bottom: $space-l;
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

.notice {
    font-size: $font-size-s;
    color: $almost-black;
    margin-bottom: $space-m;
}

.reviewer-tip {
    width: 1.2em;
    height: 1.2em;
    fill: primary-dark;
}

.radio-group {
    display: flex;
    align-items: center;
    gap: $space-xs;
    margin-bottom: $space-l;

    .radio-group-title {
        padding-left: $space-s;
        font-size: $font-size-m;
        font-weight: 500;
        color: $almost-black;
    }
}

.category-form {
    display: flex;
    flex-direction: column;
    gap: $space-l;
}

.no-child {
    font-style: italic;
    color: $mid-gray;
}

.category-child {
    display: flex;
    align-items: center;
    gap: $space-m;
    padding: 0.4rem;
    border-radius: 0.4rem;
    margin-block: $space-s;
    border: $border-width-s solid $light-gray;
    cursor: move;

    // make text unselectable
    user-select: none;

    .drag-icon {
        display: inline-block;

        svg {
            width: 1.2em;
            height: 1.2em;
            fill: $mid-gray;
        }
    }
}

.child-ghost {
    background-color: $primary-lighter;
}

.flip-list-move {
    transition: transform 0.5s;
}

.category-previewer {
    margin-block: 0.8rem;
}

.field-tip {
    margin-block: 0.8rem;
}
</style>
