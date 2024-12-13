<template>
    <div class="event">
        <div class="date">
            <SkeletonComponent class="day-skeleton" height="2.125rem" width="2.125rem" />
            <div class="day-month">
                <div class="day">
                    <SkeletonComponent class="day-skeleton" height="1rem" width="4rem" />
                </div>
                <div class="month">
                    <SkeletonComponent height=".8rem" width="4rem" />
                </div>
            </div>
        </div>
        <div class="texts">
            <SkeletonComponent tag="h4" class="event-name" height="1rem" width="60%" />
            <SkeletonComponent tag="p" class="event-information" height=".8rem" width="100%" />
        </div>
    </div>
</template>
<script>
import SkeletonComponent from '@/components/base/loader/SkeletonComponent.vue'

export default {
    name: 'EventItemSkeleton',

    components: {
        SkeletonComponent,
    },
}
</script>
<style lang="scss" scoped>
.event {
    display: flex;
    flex-wrap: nowrap;
    gap: $space-l;
    align-items: flex-start;
    justify-content: stretch;
    position: relative;
    padding: $space-m;
    border-radius: $border-radius-m;

    .date {
        flex-shrink: 0;
        display: flex;
        flex-wrap: nowrap;
        gap: $space-2xs;
        justify-content: flex-start;
        align-items: center;

        .icon {
            width: $layout-size-3xl;
            fill: $primary-dark;
        }

        .day-month {
            color: $primary-dark;
            font-weight: 900;
        }
    }

    .texts {
        flex-grow: 1;
        color: $primary-dark;
    }

    .day-skeleton {
        margin-bottom: $space-xs;
    }

    .event-name {
        margin-bottom: $space-s;
    }
}
</style>
