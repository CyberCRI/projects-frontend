<template>
    <button
        type="button"
        class="labelled-menu-item"
        :class="{ 'is-active': item.isActive ? item.isActive() : null }"
        @click="item.action"
        :title="item.title"
        :disabled="item.isDisabled ? item.isDisabled() : null"
        v-text="item.label"
    ></button>
</template>
<script>
export default {
    name: 'TextButtonMenuItem',
    emits: ['click'],

    props: {
        item: {
            type: Object,
            required: true,
        },
    },
}
</script>
<style lang="scss" scoped>
.labelled-menu-item {
    color: $white;
    background-color: $primary-dark;
    white-space: nowrap;
    border: $border-width-s solid $white;
    border-radius: $border-radius-xs;

    &.is-active,
    &:hover {
        background-color: $white;
        color: $primary-dark;
    }
}
</style>
