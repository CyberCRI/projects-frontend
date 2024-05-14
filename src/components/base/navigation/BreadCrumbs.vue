<template>
    <div class="breadcrumbs" v-if="!isLoading">
        <router-link to="/" class="home-icon">
            <IconImage name="Home" />
        </router-link>
        <span class="item" v-for="(breadcrumb, index) in breadcrumbs" :key="index">
            <router-link :to="breadcrumb.route" class="item-link">{{
                breadcrumb.name
            }}</router-link>
            <span class="item-icon" v-if="index !== breadcrumbs.length - 1">
                <IconImage name="ChevronRight" />
            </span>
        </span>
        <span class="item" v-if="groupName">
            <span class="item-icon">
                <IconImage name="ChevronRight" />
            </span>
            <router-link :to="$route.path" class="item-link">{{ groupName }}</router-link>
        </span>
    </div>
    <BreadCrumbsSkeleton v-else />
</template>

<script>
import IconImage from '@/components/base/media/IconImage.vue'
import BreadCrumbsSkeleton from '@/components/base/navigation/BreadCrumbsSkeleton.vue'
export default {
    name: 'BreadCrumbs',
    components: { IconImage, BreadCrumbsSkeleton },
    props: {
        breadcrumbs: {
            type: Array,
            required: true,
        },

        groupName: {
            type: String,
            required: true,
        },
        isLoading: {
            type: Boolean,
            default: false,
            required: false,
        },
    },
}
</script>

<style lang="scss" scoped>
.breadcrumbs {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-wrap: wrap;
    gap: $space-2xs;
    padding: $space-unit 0;

    .item {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        flex-wrap: wrap;
        gap: $space-2xs;

        &-link {
            color: $primary-dark;
            font-size: $font-size-s;
            font-weight: 400;
        }

        &-icon svg {
            fill: $primary-dark;
            width: $font-size-xl;
            height: $font-size-m;
        }
    }

    .home-icon svg {
        fill: $primary-dark;
        width: $font-size-xl;
        height: $font-size-m;
    }
}
</style>
