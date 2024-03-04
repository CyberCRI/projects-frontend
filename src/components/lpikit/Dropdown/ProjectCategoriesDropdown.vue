<template>
    <div v-click-outside="close">
        <button class="categories" @click="toggle_categories">
            <span class="categories-btn">{{ $t('project.categories') }}</span>
            <IconImage class="caret" :name="open ? 'ChevronUp' : 'ChevronDown'" />
        </button>
        <div v-if="open" class="choose-project-categories">
            <div class="drop-down-menu custom-scrollbar">
                <ul>
                    <li
                        v-for="(item, index) in categories"
                        :key="index"
                        class="drop-down-menu-item"
                    >
                        <div class="drop-down-menu-item-content" @click="goTo(item)">
                            <span class="label">{{ $filters.capitalize(item.name) }}</span>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import IconImage from '@/components/svgs/IconImage.vue'

export default {
    name: 'ProjectCategoriesDropdown',

    emits: ['close'],

    components: {
        IconImage,
    },

    computed: {
        categories() {
            return this.$store.getters['projectCategories/allOrderedByOrderId']
        },
    },
    data() {
        return {
            open: false,
        }
    },

    methods: {
        goTo(item) {
            this.$router.push(`/category/${item.id}`)
        },
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

.drop-down-menu {
    background-color: $primary-dark;
    border-bottom-left-radius: $border-radius-xs;
    border-bottom-right-radius: $border-radius-xs;
    max-height: pxToRem(450px);
    padding-block: $border-radius-s;
    transition: 0.15s all ease-in-out;
    cursor: pointer;
    will-change: transform;
    overflow-y: scroll;

    .drop-down-menu-item {
        padding: 0 $space-l;
        position: relative;

        .drop-down-menu-item-content {
            color: $white;
            padding: $space-m 0;
            font-size: $font-size-s;
            display: flex;
            align-items: center;
            font-family: Ubuntu, 'Noto Sans SC', helvetica, arial, sans-serif;

            .label {
                transform-origin: left center;
                transition: transform 200ms ease-in-out;
                font-weight: 400;
                font-size: $font-size-m;
            }
        }

        &:hover {
            .drop-down-menu-item-content {
                .label {
                    color: $green-light;
                    transform: scaleX(1.1);
                }
            }
        }
    }
}

.custom-scrollbar::-webkit-scrollbar {
    width: 11px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: $white;
    border: solid 3px $primary-dark;
    border-radius: $scrollbar-radius;
}

.custom-scrollbar::-webkit-scrollbar-track {
    border: solid 3px $primary-dark;
    border-radius: $scrollbar-radius;
}
</style>
