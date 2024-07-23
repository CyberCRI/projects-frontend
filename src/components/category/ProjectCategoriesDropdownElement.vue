<template>
    <li class="drop-down-menu-item">
        <router-link
            class="drop-down-menu-item-content"
            :to="{ name: 'Category', params: { id: category.id } }"
        >
            <span class="label">{{ $filters.capitalize(category.name) }}</span>
        </router-link>
        <ul class="sub-list">
            <ProjectCategoriesDropdownElement
                :category="child"
                v-for="child in category.children"
                :key="child.id"
            />
        </ul>
    </li>
</template>

<script>
export default {
    name: 'ProjectCategoriesDropdownElement',

    props: {
        category: {
            type: Object,
            required: true,
        },
    },
}
</script>

<style lang="scss" scoped>
.drop-down-menu-item {
    position: relative;

    .drop-down-menu-item-content {
        color: $primary-dark;
        padding: $space-m $space-s;
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

        &:hover {
            background-color: $primary-light;

            .label {
                transform: scaleX(1.1);
            }
        }
    }
}

.sub-list {
    margin-left: 2ex;
}
</style>
