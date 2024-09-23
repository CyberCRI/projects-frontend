<template>
    <div
        class="project-categories-dropdown"
        v-click-outside="close"
        :class="{ 'is-open': open }"
        v-if="categories?.length"
    >
        <button type="button" class="categories toggle-btn" @click="toggle_categories">
            <span class="categories-btn">{{ dropdownLabel }}</span>
            <IconImage class="caret" :name="open ? 'ChevronUp' : 'ChevronDown'" />
        </button>
        <transition name="slide">
            <div v-if="open" class="choose-project-categories">
                <div class="drop-down-menu custom-scrollbar">
                    <ul>
                        <ProjectCategoriesDropdownElement
                            v-for="category in categories"
                            :key="category.id"
                            :category="category"
                        >
                            <template #default="{ category: child }">
                                <slot name="default" :category="child"></slot>
                            </template>
                        </ProjectCategoriesDropdownElement>
                    </ul>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
import IconImage from '@/components/base/media/IconImage.vue'
import ProjectCategoriesDropdownElement from '@/components/category/ProjectCategoriesDropdownElement.vue'
import useProjectCategories from '@/stores/useProjectCategories.ts'
export default {
    name: 'ProjectCategoriesDropdown',

    emits: ['close'],

    components: {
        IconImage,
        ProjectCategoriesDropdownElement,
    },

    setup() {
        const projectCategoriesStore = useProjectCategories()
        return {
            projectCategoriesStore,
        }
    },

    props: {
        dropdownLabel: {
            type: String,
            required: true,
        },
    },

    data() {
        return {
            open: false,
        }
    },
    computed: {
        categories() {
            return this.projectCategoriesStore.hierarchy
        },
    },
    methods: {
        close() {
            this.open = false
        },
        toggle_categories() {
            this.open = !this.open
        },
    },
}
</script>

<style lang="scss" scoped>
.project-categories-dropdown {
    position: relative;

    &.is-open,
    &.is-open .choose-project-categories {
        box-shadow: 0 12px 12px rgb(0 0 0 / 30%);
    }
}

.categories {
    border: 1px solid $lighter-gray;
    border-radius: $border-radius-s;
    height: pxToRem(50px);
    display: flex;
    justify-content: space-between;
    padding-inline: $space-m;
    align-items: center;
    width: 100%;
    background-color: transparent;

    @media (min-width: $min-tablet) {
        margin-top: $space-l;
    }

    .categories-btn {
        color: $primary-dark;
        font-size: $font-size-m;
        font-weight: 700;
    }

    .caret {
        margin-left: $space-l;
        fill: $primary-dark;
        width: pxToRem(20px);
    }
}

.is-open .categories {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    border-bottom: 0;
}

.choose-project-categories {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    z-index: 10;
}

.slide-enter-active,
.slide-leave-active {
    transition: transform 0.3s;
    transform-origin: top center;
}

.slide-enter-to,
.slide-leave-from {
    transform: scaleY(1);

    :deep(a) {
        opacity: 0;
    }
}

.slide-enter-from,
.slide-leave-to {
    transform: scaleY(0) translateY(-2rem);

    :deep(a) {
        opacity: 0;
    }
}

.drop-down-menu {
    background-color: $white;
    border-width: 0 1px 1px;
    border-style: solid;
    border-color: $lighter-gray;
    border-bottom-left-radius: $border-radius-xs;
    border-bottom-right-radius: $border-radius-xs;
    max-height: pxToRem(450px);
    padding: $space-s $space-xs;
    transition: 0.15s all ease-in-out;
    cursor: pointer;
    will-change: transform;
    overflow-y: scroll;
}
</style>
