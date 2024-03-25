<template>
    <p class="clamped">{{ instructionText }}</p>
</template>
<script>
export default {
    name: 'InstructionAdminListItem',
    props: {
        instruction: {
            type: Object,
            default: () => ({}),
        },
    },

    computed: {
        instructionText() {
            return this.instruction.content.replace(/<[^>]+>/g, ' ').substring(0, 255)
        },
    },
}
</script>
<style lang="scss" scoped>
.clamped {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    line-height: 1.5;
}
</style>
