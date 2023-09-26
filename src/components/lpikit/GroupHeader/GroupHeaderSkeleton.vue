<template>
    <div class="group">
        <SkeletonComponent class="image" />
        <div class="infos">
            <SkeletonComponent width="50%" height="25px" />
            <SkeletonComponent width="30%" height="20px" />
        </div>
        <div class="options">
            <SkeletonComponent class="item" />
            <SkeletonComponent class="item" />
        </div>
    </div>
</template>

<script>
import SkeletonComponent from '@/components/lpikit/Skeleton/SkeletonComponent.vue'
export default {
    name: 'GroupHeaderSkeleton',
    components: { SkeletonComponent },
}
</script>

<style lang="scss" scoped>
.group {
    background: $primary-lighter;
    padding: calc($space-2xs * 5) calc($space-s * 5);
    display: flex;
    align-items: center;
    justify-content: flex-start;
    border-radius: $border-radius-l;
    gap: calc($space-s * 5);
    margin-bottom: pxToRem(30px);

    .image {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        border: 5px solid $white;
        flex-shrink: 0;
    }

    .infos {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: calc($space-2xs * 5);
    }

    .options {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: $space-m;

        .item {
            height: 30px;
            width: 30px;
            border-radius: $border-radius-s;
        }
    }
}

@media screen and (max-width: $med-tablet) {
    .group {
        flex-direction: column;
        align-items: flex-start;
        gap: calc($space-2xs * 5);
        padding: calc($space-2xs * 5);

        .image {
            width: 200px;
            height: 200px;
            align-self: center;
        }
    }
}
</style>
