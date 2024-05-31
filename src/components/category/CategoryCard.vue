<template>
    <button class="category-card-ctn" @click="goTo">
        <span
            :class="[isSelected, size]"
            :style="{ width: imageWidth }"
            class="category-card shadow-box"
        >
            <span v-if="selected" class="selected-icon">
                <IconImage class="icon" name="Check" />
            </span>

            <ContextActionButton
                v-if="editable"
                class="edit-button"
                action-icon="Pen"
                @click="editCategory"
            />

            <CategoryCardImage
                :background-color="category.background_color"
                :image-height="imageHeight"
                :image-width="imageWidth"
                :url="imageSource"
                class="category-card-image"
            />
            <span class="category-card--name">{{ $filters.capitalize(category.name) }}</span>
        </span>
    </button>
</template>

<script>
import CategoryCardImage from '@/components/category/CategoryCardImage.vue'
import IconImage from '@/components/base/media/IconImage.vue'
import ContextActionButton from '@/components/base/button/ContextActionButton.vue'

export default {
    name: 'CategoryCard',

    emits: ['edit-category', 'go-to'],

    components: {
        CategoryCardImage,
        IconImage,
        ContextActionButton,
    },

    props: {
        category: {
            type: Object,
            required: true,
        },

        size: {
            type: String,
            default: '',
            validator(value) {
                return ['big', 'small', 'extra-small', ''].includes(value)
            },
        },

        selected: {
            type: Boolean,
            default: false,
        },

        editable: {
            type: Boolean,
            default: false,
        },
    },

    computed: {
        isSelected() {
            return this.selected ? 'category-card__selected' : null
        },

        imageWidth() {
            if (this.size === 'big') return '344px'
            if (this.size === 'small') return '222px'
            if (this.size === 'extra-small') return '166px'
            return ''
        },

        imageHeight() {
            if (this.size === 'big') return '137px'
            if (this.size === 'small') return '50px'
            if (this.size === 'extra-small') return '37px'
            return ''
        },

        imageSource() {
            if (this.category.background_image)
                return this.category.background_image.variations.small
            else return null
        },
    },

    methods: {
        editCategory() {
            this.$emit('edit-category')
        },

        goTo() {
            this.$emit('go-to', this.category.id)
        },
    },
}
</script>

<style lang="scss" scoped>
.category-card-ctn {
    position: relative;
    cursor: pointer;
    background: none;
    border: none;

    .category-card {
        border: $border-width-s solid $green;
        border-radius: $border-radius-m;
        display: flex;
        flex-direction: column;
        position: relative;

        .selected-icon {
            width: 30px;
            height: 30px;
            border-radius: 15px;
            background-color: $blue-lighter;
            box-shadow: 0 0 0 3px $primary-dark;
            display: flex;
            justify-content: center;
            align-items: center;
            position: absolute;
            left: 20px;
            top: -13px;

            .icon {
                height: 16px;
                fill: $primary-dark;
            }
        }

        .edit-button {
            position: absolute;
            right: 20px;
            top: -18px;
        }

        .category-card--name {
            text-align: center;
            overflow: hidden;
            text-overflow: ellipsis;
            font-weight: 700;
            font-size: $font-size-m;
            padding: $space-s $space-2xl;
            background: $white;
            color: $black;
            transition: background-color 0.3s ease-in-out;
            border-bottom-left-radius: $border-radius-m;
            border-bottom-right-radius: $border-radius-m;
        }

        &__selected {
            .category-card--name {
                color: $white;
                background-color: $primary-dark;
            }

            background-color: $primary-dark;
        }

        &:hover:not(.category-card__selected) {
            .category-card--name {
                background-color: $green-lighter;
            }
        }

        &.small {
            .category-card--name {
                padding: $space-s;
            }
        }

        &.extra-small {
            .category-card--name {
                padding: $space-xs;
                font-size: $font-size-s;
                line-height: $line-height-squashed;
            }
        }
    }
}

:deep(.category-card-image) {
    border-top-left-radius: $border-radius-m;
    border-top-right-radius: $border-radius-m;
    overflow: hidden;
}
</style>
