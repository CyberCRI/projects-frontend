<template>
    <div class="drop-down-menu custom-scrollbar">
        <ul>
            <li v-for="(item, index) in categories" :key="index" class="drop-down-menu-item">
                <router-link
                    class="drop-down-menu-item-content"
                    :to="{ name: 'Category', params: { id: item.id } }"
                >
                    <span class="label">{{ $filters.capitalize(item.name) }}</span>
                </router-link>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    name: 'DropdownCategories',

    computed: {
        categories() {
            return this.$store.getters['projectCategories/allOrderedByOrderId']
        },
    },
}
</script>

<style lang="scss" scoped>
.drop-down-menu {
    background-color: $white;
    border-width: 0 1px 1px;
    border-style: solid;
    border-color: $gray-10;
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
