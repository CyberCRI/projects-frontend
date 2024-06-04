<template>
    <div class="contextual-tool-menu">
        <slot> </slot>
    </div>
</template>
<script>
export default {
    name: 'ContexttualToolMenu',
}
</script>
<style lang="scss" scoped>
.contextual-tool-menu {
    position: relative;
    align-items: center;
    background: $primary-dark;
    color: $white;
    display: flex;
    border-radius: $border-radius-xs;
    padding: $space-xs $space-s;
    gap: $space-s;
    filter: drop-shadow(0 2px 5px rgb(54 54 54 / 50%));

    &::after {
        content: '';
        width: 0;
        height: 0;
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
        border-top: 10px solid $primary-dark;
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translate(-50%, 0);
    }

    :deep(.menu-item) {
        color: $white;
    }
}
</style>
