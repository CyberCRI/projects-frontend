<template>
    <button
        type="button"
        class="drop-down-menu-item-content"
        @click="$emit('choose-category', category)"
        :data-test="`project-form-${category.id}`"
    >
        <span class="label">{{ $filters.capitalize(category.name) }}</span>
    </button>
</template>

<script>
export default {
    name: 'ProjectCategoriesDropdownElementButton',

    emits: ['choose-category'],

    props: {
        category: {
            type: Object,
            required: true,
        },
    },
}
</script>

<style lang="scss" scoped>
.drop-down-menu-item-content {
    color: $primary-dark;
    padding: $space-m $space-s;
    font-size: $font-size-s;
    display: flex;
    align-items: center;
    font-family: Ubuntu, 'Noto Sans SC', helvetica, arial, sans-serif;
    border: 0 none;
    appearance: none;
    background-color: white;
    transition: transform 200ms ease-in-out;
    width: auto;

    .label {
        transform-origin: left center;
        font-weight: 400;
        font-size: $font-size-m;
    }

    &:hover {
        background-color: $primary-light;
        transform: scaleX(1.1);
    }
}
</style>
