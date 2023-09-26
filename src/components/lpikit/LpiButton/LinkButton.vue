<template>
    <button class="link-btn" @click="$emit('click')">{{ label }}</button>
</template>

<script>
export default {
    name: 'LinkButton',

    emits: ['click'],

    props: {
        label: {
            type: String,
            default: '',
        },
    },
}
</script>

<style lang="scss" scoped>
.link-btn {
    text-decoration: underline;
    color: $primary;
    font-size: $font-size-m;
    font-weight: 400;
    background: $transparent;
    display: inline-block;
    border: none;
    font-family: Ubuntu, 'Noto Sans SC', helvetica, arial, sans-serif;
    cursor: pointer;
}
</style>
