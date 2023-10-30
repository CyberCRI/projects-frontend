<template>
    <DynamicGrid :min-gap="minGap" class="project-list">
        <div v-for="(item, index) in limit" :key="index" class="card">
            <div class="content">
                <div class="image-placeholder" />
                <div class="text-placeholder" />

                <div class="text-placeholder subtext" />
                <div class="text-placeholder" />

                <div class="text-placeholder" />
            </div>
        </div>
    </DynamicGrid>
</template>

<script>
import DynamicGrid from '@/components/lpikit/DynamicGrid/DynamicGrid.vue'
export default {
    name: 'ProjectListSkeleton',

    components: {
        DynamicGrid,
    },

    props: {
        limit: {
            type: Number,
            default: 12,
        },
        minGap: {
            type: Number,
            default: 0,
        },
    },
}
</script>

<style lang="scss" scoped>
.project-list {
    margin-top: $space-xl;

    .card {
        height: pxToRem(256px);
        width: pxToRem(185px);
        border: $border-width-s solid $gray-9;
        border-radius: $border-radius-m;
        overflow: hidden;
    }

    .content {
        padding: $space-m;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .image-placeholder {
        width: pxToRem(72px);
        height: pxToRem(72px);
        background: $gray-10;
        margin-bottom: $space-l;
        border-radius: $border-radius-xs;
        animation: skeleton-loading 1s linear infinite alternate;
    }

    .text-placeholder {
        background: $gray-10;
        border-radius: $border-radius-xs;
        width: 100%;
        height: pxToRem(16px);
        margin-bottom: pxToRem(16px);
        animation: skeleton-loading 1s linear infinite alternate;
    }

    .subtext {
        margin-bottom: $space-s;
    }

    .footer {
        margin-top: $space-l;
    }
}
</style>
