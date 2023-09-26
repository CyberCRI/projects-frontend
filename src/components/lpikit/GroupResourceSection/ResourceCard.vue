<template>
    <div class="resource-card">
        <IconImage name="File" v-if="resource.type === 'file'" />
        <IconImage name="LinkRotated" v-else />

        <span>{{ resource.description }}</span>
    </div>
</template>

<script>
import IconImage from '@/components/svgs/IconImage.vue'

export default {
    name: 'ResourceCard',

    components: {
        IconImage,
    },

    props: {
        resource: {
            type: Object,
            default: () => {},
        },
    },
}
</script>

<style lang="scss" scoped>
.resource-card {
    display: flex;
    align-items: center;
    padding: $space-xs $space-s;
    border: $border-width-s solid $primary;
    border-radius: $border-radius-m;
    box-sizing: border-box;

    svg {
        fill: $primary;
        width: 40px;
        height: 40px;
        margin-right: $space-m;
    }
}
</style>
