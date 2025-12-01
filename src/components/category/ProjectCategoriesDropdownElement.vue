<template>
  <li class="drop-down-menu-item">
    <slot name="default" :category="category" />
    <ul class="sub-list">
      <ProjectCategoriesDropdownElement
        v-for="child in category.children"
        :key="child.id"
        :category="child"
      >
        <template #default="{ category: child_ }">
          <slot name="default" :category="child_" />
        </template>
      </ProjectCategoriesDropdownElement>
    </ul>
  </li>
</template>

<script>
export default {
  name: 'ProjectCategoriesDropdownElement',

  props: {
    category: {
      type: Object,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>
.drop-down-menu-item {
  position: relative;

  .drop-down-menu-item-content {
    color: $primary-dark;
    padding: $space-m $space-s;
    font-size: $font-size-s;
    display: flex;
    align-items: center;
    font-family: Ubuntu, 'Noto Sans SC', helvetica, arial, sans-serif;

    .label {
      transform-origin: left center;
      transition: transform 200ms ease-in-out;
      font-weight: 400;
      font-size: $font-size-m;
      transform: translateZ(0);
    }

    &:hover {
      background-color: $primary-light;

      .label {
        transform: translateZ(0) scaleX(1.1);
      }
    }
  }
}

.sub-list {
  margin-left: 2ex;
}
</style>
