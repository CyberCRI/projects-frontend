<template>
    <div class="project-categories-dropdown" v-click-outside="close" :class="{ 'is-open': open }">
        <button class="categories" @click="toggle_categories">
            <span class="categories-btn">{{ $t('project.categories') }}</span>
            <IconImage class="caret" :name="open ? 'ChevronUp' : 'ChevronDown'" />
        </button>
        <transition name="slide">
            <div v-if="open" class="choose-project-categories">
                <DropdownCategories />
            </div>
        </transition>
    </div>
</template>

<script>
import IconImage from '@/components/base/media/IconImage.vue'
import DropdownCategories from '@/components/category/DropdownCategories.vue'

export default {
    name: 'ProjectCategoriesDropdown',

    emits: ['close'],

    components: {
        IconImage,
        DropdownCategories,
    },

    data() {
        return {
            open: false,
        }
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
    border: 1px solid $gray-10;
    border-radius: $border-radius-s;
    height: pxToRem(50px);
    display: flex;
    justify-content: space-between;
    padding-inline: $space-m;
    align-items: center;
    width: 100%;
    background-color: $transparent;

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
</style>
