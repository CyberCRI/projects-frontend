<template>
    <DynamicGrid :min-gap="minGap" class="member-list">
        <div v-for="(item, index) in limit" :key="index" class="card">
            <div class="content">
                <div class="image-placeholder" />
                <div class="text-placeholder" />

                <div class="text-placeholder subtext" />
                <div class="text-placeholder" />
            </div>
        </div>
    </DynamicGrid>
</template>

<script>
import DynamicGrid from '@/components/base/DynamicGrid.vue'
export default {
    name: 'MemberListSkeleton',

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
.member-list {
    justify-content: space-between;
    width: 100%;

    .card {
        height: pxToRem(196px);
        width: pxToRem(120px);
        overflow: hidden;
    }

    .content {
        padding: $space-m;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .image-placeholder {
        width: pxToRem(120px);
        height: pxToRem(120px);
        background: $lighter-gray;
        margin-bottom: $space-m;
        border-radius: 50%;
        animation: skeleton-loading 1s linear infinite alternate;
    }

    .text-placeholder {
        background: $lighter-gray;
        border-radius: $border-radius-xs;
        width: 100%;
        height: pxToRem(8px);
        margin-bottom: pxToRem(8px);
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
