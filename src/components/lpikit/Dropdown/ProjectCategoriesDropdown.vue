<template>
    <div v-click-outside="close">
        <button class="categories" @click="toggle_categories">
            <span class="categories-btn">{{ $t('project.categories') }}</span>
            <IconImage class="caret" :name="open ? 'ChevronUp' : 'ChevronDown'" />
        </button>
        <div v-if="open" class="choose-project-categories">
            <DropdownCategories />
        </div>
    </div>
</template>

<script>
import IconImage from '@/components/svgs/IconImage.vue'
import DropdownCategories from '@/components/lpikit/Dropdown/DropdownCategories.vue'

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

.choose-project-categories {
    display: flex;
    flex-direction: column;
    padding: $space-xs;
    padding-top: $space-2xs;
}
</style>
