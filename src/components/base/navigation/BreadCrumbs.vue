<template>
  <div v-if="!isLoading" class="breadcrumbs">
    <NuxtLink to="/" class="home-icon">
      <IconImage name="Home" />
    </NuxtLink>
    <span v-for="(breadcrumb, index) in breadcrumbs" :key="index" class="item">
      <NuxtLink :to="breadcrumb.route" class="item-link">{{ breadcrumb.name }}</NuxtLink>
      <span v-if="index !== breadcrumbs.length - 1" class="item-icon">
        <IconImage name="ChevronRight" />
      </span>
    </span>
    <span v-if="groupName" class="item">
      <span class="item-icon">
        <IconImage name="ChevronRight" />
      </span>
      <NuxtLink :to="$route.path" class="item-link">{{ groupName }}</NuxtLink>
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
      default: '',
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
      width: $layout-size-xl;
      height: $layout-size-m;
    }
  }

  .home-icon svg {
    fill: $primary-dark;
    width: $layout-size-xl;
    height: $layout-size-m;
  }
}
</style>
