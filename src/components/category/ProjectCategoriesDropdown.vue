<template>
    <div
        class="project-categories-dropdown"
        v-click-outside="close"
        :class="{ 'is-open': open }"
        v-if="categories?.length"
    >
        <button class="categories" @click="toggle_categories">
            <span class="categories-btn">{{ $t('project.categories') }}</span>
            <IconImage class="caret" :name="open ? 'ChevronUp' : 'ChevronDown'" />
        </button>
        <transition name="slide">
            <div v-if="open" class="choose-project-categories">
                <div class="drop-down-menu custom-scrollbar">
                    <ul>
                        <li v-for="item in categories" :key="item.id" class="drop-down-menu-item">
                            <router-link
                                class="drop-down-menu-item-content"
                                :to="{ name: 'Category', params: { id: item.id } }"
                            >
                                <span class="label">{{ $filters.capitalize(item.name) }}</span>
                            </router-link>
                        </li>
                    </ul>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
import IconImage from '@/components/base/media/IconImage.vue'

export default {
    name: 'ProjectCategoriesDropdown',

    emits: ['close'],

    components: {
        IconImage,
    },

    data() {
        return {
            open: false,
        }
    },
    computed: {
        categories() {
            return this.$store.getters['projectCategories/allOrderedByOrderId']
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
    padding-block: $border-radius-s;
    transition: 0.15s all ease-in-out;
    cursor: pointer;
    will-change: transform;
    overflow-y: scroll;

    .drop-down-menu-item {
        padding: 0 $space-l;
        position: relative;

        .drop-down-menu-item-content {
            color: $primary-dark;
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
            background-color: $primary-light;

            .drop-down-menu-item-content {
                .label {
                    transform: scaleX(1.1);
                }
            }
        }
    }
}
</style>
