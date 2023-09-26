<template>
    <CategoryLink class="category-badge" :project="project" :category="project.categories[0]">
        <ProjectIcon
            v-if="horizontalDisplay"
            :project="project"
            :privacy-icon-visible="privacyIconVisible"
        />

        <div class="main-category">
            <div
                v-if="hasDot"
                class="dot"
                :class="{ border: categoryBackgroundWhite }"
                :style="{ background: project.categories[0].background_color }"
            />

            <div class="category-label">{{ project.categories[0].name }}</div>

            <ToolTip v-if="multipleCategories">
                <template #custom-content>
                    <ul class="additional-categories">
                        <CategoryLink
                            v-for="category in project.categories.slice(1)"
                            :key="category.id"
                            :project="project"
                            :category="category"
                        >
                            <li>
                                <div
                                    class="dot"
                                    :style="`background-color: ${category.background_color};`"
                                    :class="{ border: categoryBackgroundWhite }"
                                />
                                {{ category.name }}
                            </li>
                        </CategoryLink>
                    </ul>
                </template>
                <div class="additional-label" @click.prevent="() => {}">
                    {{ `+${project.categories.length - 1}` }}
                </div>
            </ToolTip>
        </div>
    </CategoryLink>
</template>

<script>
import ProjectIcon from '../ProjectCard/ProjectIcon.vue'
import ToolTip from '@/components/lpikit/ToolTip/ToolTip.vue'
import CategoryLink from './CategoryLink.vue'

export default {
    name: 'CategoryBadge',

    components: { ProjectIcon, ToolTip, CategoryLink },

    props: {
        project: {
            type: Object,
            required: true,
        },

        horizontalDisplay: {
            type: Boolean,
            default: false,
        },

        privacyIconVisible: {
            type: Boolean,
            default: false,
        },
        hasDot: {
            type: Boolean,
            default: true,
        },
    },

    computed: {
        categoryBackgroundWhite() {
            return (
                this.project &&
                this.project.categories &&
                this.project.categories.length &&
                (this.project.categories[0].background_color.toUpperCase() === '#FFF' ||
                    this.project.categories[0].background_color.toUpperCase() === '#FFFFFF')
            )
        },

        multipleCategories() {
            return this.project.categories && this.project.categories.length > 1
        },
    },
}
</script>

<style lang="scss" scoped>
.category-badge {
    display: flex;
    align-items: center;
    opacity: 1;
    transition: all 0.8s ease-in-out;
    z-index: 1;

    .main-icon {
        margin-right: 10px;
    }

    .main-category {
        background: $white;
        border: $border-width-s solid $green;
        color: $primary-dark;
        padding: $space-xs $space-s;
        border-radius: $border-radius-l;
        font-weight: bold;
        font-size: $font-size-xs;
        display: flex;
        justify-content: space-between;
        align-items: center;
        white-space: nowrap;
        height: 37px;
        box-sizing: border-box;

        .dot {
            width: 16px;
            height: 16px;
            border-radius: 50%;
            border: 1px solid $white;
            margin-right: $space-2xs;

            &.border {
                border: 1px solid $black;
            }
        }

        .category-label {
            text-transform: uppercase;
        }

        .additional-label {
            font-size: $font-size-2xs;
            width: 20px;
            height: 20px;
            background: $primary-lighter;
            border-radius: 100%;
            border: $border-width-s solid $primary-dark;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-left: $space-2xs;
        }

        .additional-categories {
            list-style-type: none;
            background: $primary-dark;
            color: $white;
            border-radius: $border-radius-m;
            padding: $space-xs;
            border: none;
            box-shadow: none;

            li {
                display: flex;
                align-items: center;
                font-weight: 700;
                font-size: $font-size-xs;
            }
        }
    }
}
</style>
