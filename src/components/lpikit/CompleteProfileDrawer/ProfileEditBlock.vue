<template>
    <section class="profile-edit-block">
        <h2 v-if="blockTitle" class="section-title">{{ blockTitle }}</h2>
        <slot></slot>
    </section>
</template>

<script>
export default {
    name: 'ProfileEditBlock',

    props: {
        blockTitle: {
            type: String,
            default: '',
        },
    },
}
</script>
<style lang="scss" scoped>
.profile-edit-block {
    padding: pxToRem(43px) pxToRem(63px);
    border-radius: pxToRem(21px);
    border: $border-width-m solid $gray-10;
}
.section-title {
    font-size: $font-size-2xl;
    font-weight: 700;
    margin-bottom: 41px;
}
</style>
