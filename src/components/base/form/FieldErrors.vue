<template>
    <p v-for="error of errors" :key="error.$uid" class="error-description">
        {{ error.$message }}
    </p>
</template>
<script>
export default {
    name: 'FieldErrors',

    props: {
        errors: {
            type: Array,
            default: () => [],
        },
    },
}
</script>
<style lang="scss" scoped>
.error-description {
    color: $red;
    margin-top: $space-s;
}
</style>
