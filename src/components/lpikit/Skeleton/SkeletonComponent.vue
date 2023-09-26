<template>
    <component
        :is="tag"
        :style="{ height, width, 'border-radius': borderRadius }"
        class="skeleton"
    />
</template>

<script>
export default {
    name: 'SkeletonComponent',

    props: {
        tag: {
            type: String,
            default: 'div',
        },

        height: {
            type: String,
            default: '',
        },

        width: {
            type: String,
            default: '',
        },

        borderRadius: {
            type: String,
            default: '',
        },
    },
}
</script>

<style lang="scss" scoped>
.skeleton {
    border-radius: $border-radius-m;
    animation: skeleton-loading 1s linear infinite alternate;
}
</style>
