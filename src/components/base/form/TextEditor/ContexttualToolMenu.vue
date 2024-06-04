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
}
</style>
