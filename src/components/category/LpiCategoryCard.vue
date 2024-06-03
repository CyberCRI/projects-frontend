<template>
    <div class="category-card-ctn" @click="goTo">
        <div :class="[isSelected]" :style="{ width: imageWidth }" class="category-card shadow-box">
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

            <div class="title-description-ctn">
                <h3 class="title">{{ $filters.capitalize(category.name) }}</h3>
                <p class="description" v-html="category.description"></p>
            </div>
        </div>
    </div>
</template>

<script>
import CategoryCardImage from '@/components/category/CategoryCardImage.vue'
import ContextActionButton from '@/components/base/button/ContextActionButton.vue'

export default {
    name: 'LpiCategoryCard',

    emits: ['edit-category', 'click'],

    components: {
        CategoryCardImage,
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
            if (this.size === 'small') return '288px'
            if (this.size === 'extra-small') return '166px'
            return ''
        },

        imageHeight() {
            if (this.size === 'big') return '137px'
            if (this.size === 'small') return '76px'
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
            this.$emit('click', this.category.id)
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
        border: $border-width-s solid $primary;
        border-radius: $border-radius-m;
        display: flex;
        flex-direction: column;
        position: relative;
        overflow: hidden;

        .edit-button {
            position: absolute;
            right: 20px;
            top: -18px;
        }

        .title-description-ctn {
            padding: $space-s $space-m $space-m $space-l;

            .title {
                overflow: hidden;
                text-overflow: ellipsis;
                font-weight: 700;
                font-size: $font-size-2xl;
                line-height: $line-height-tight;
                background: $white;
                color: $black;
                transition: background-color 0.3s ease-in-out;
                border-bottom-left-radius: $border-radius-m;
                border-bottom-right-radius: $border-radius-m;
            }

            .description {
                margin-top: pxToRem(16px);
                font-weight: 400;
                font-size: $font-size-m;
                color: $black;
                transition: background-color 0.3s ease-in-out;
                border-bottom-left-radius: $border-radius-m;
                border-bottom-right-radius: $border-radius-m;
                -webkit-line-clamp: 3;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        }

        &:hover:not(.category-card__selected) {
            .category-card__name {
                background-color: $green-lighter;
            }
        }
    }
}
</style>
