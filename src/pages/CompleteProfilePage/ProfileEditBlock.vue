<template>
    <section class="profile-edit-block">
        <slot></slot>
    </section>
</template>

<script>
export default {
    name: 'ProfileEditBlock',
}
</script>
<style lang="scss" scoped>
.profile-edit-block {
    padding: pxToRem(43px) pxToRem(63px);
    border-radius: pxToRem(21px);
    border: $border-width-m solid $gray-10;
}
</style>
