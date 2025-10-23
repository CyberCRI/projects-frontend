<template>
  <div v-if="subgroups.length > 0 && !isLoading" class="subgroups">
    <div class="subgroups-title">
      <span class="name">{{ t('group.subgroups') }} :</span>
    </div>
    <NuxtLink
      v-for="(subgroup, index) in subgroups"
      :key="index"
      :to="{ name: 'Group', params: { groupId: subgroup.slug || subgroup.id } }"
      class="subgroups-item"
    >
      <div class="vector" />
      <span class="name">{{ subgroup.name }}</span>
    </NuxtLink>
  </div>
  <SubGroupsSkeleton v-else-if="isLoading" />
  <div v-else class="empty-subgroups" />
</template>

<script setup>
import SubGroupsSkeleton from '@/components/group/SubGroups/SubGroupsSkeleton.vue'

defineOptions({ name: 'SubGroups' })
defineProps({
  subgroups: {
    type: Array,
    required: true,
  },
  isLoading: {
    type: Boolean,
    default: false,
    required: false,
  },
})
const { t } = useNuxtI18n()
</script>

<style lang="scss" scoped>
.empty-subgroups {
  margin-bottom: calc(pxToRem(30px) - 1rem);
}

.subgroups {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: $space-s;
  margin-bottom: pxToRem(30px);

  &-title {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: $space-m;
    background: $primary-lighter;
    border: $border-width-s solid $primary;
    border-radius: $border-radius-30;

    .name {
      font-weight: 400;
      font-size: $font-size-xs;
      display: flex;
      align-items: center;
      text-align: center;
      text-transform: uppercase;
      color: $primary-dark;
    }
  }

  &-item {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: $space-xs;
    padding: $space-2xs calc($space-2xl / 5) $space-2xs $space-2xs;
    border: $border-width-s solid $primary;
    border-radius: $border-radius-30;
    transition: 0.3s;

    &:hover {
      cursor: pointer;
      background: $primary-lighter;
    }

    .vector {
      width: 28px;
      height: 28px;
      background: $salmon;
      border-radius: 50%;
    }

    .name {
      font-weight: 400;
      font-size: $font-size-xs;
      display: flex;
      align-items: center;
      text-align: center;
      text-transform: uppercase;
      color: $primary-dark;
    }
  }
}
</style>
