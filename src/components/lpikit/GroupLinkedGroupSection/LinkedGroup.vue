<template>
    <div class="linked-group">
        <img :src="linkedGroup.image" :alt="linkedGroup.name" />

        <h3>{{ linkedGroup.name }}</h3>

        <div class="group-type">{{ linkedGroup.type }}</div>
    </div>
</template>

<script>
export default {
    name: 'LinkedGroup',

    props: {
        linkedGroup: {
            type: Object,
            default: () => {},
        },
    },
}
</script>

<style lang="scss" scoped>
.linked-group {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;

    img {
        width: 64px;
        height: 64px;
        border-radius: 50%;
    }

    h3 {
        margin: $space-m auto;
    }

    .group-type {
        background: $primary-dark;
        color: $white;
        padding: $space-xs $space-s;
    }
}
</style>
