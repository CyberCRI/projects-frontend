<template>
  <li class="list-body">
    <span class="header">
      <slot />
      <IconImage
        v-if="parent && parent.children.length > 0"
        :name="show ? 'ChevronUp' : 'ChevronDown'"
        class="icon"
        @click="show = !show"
      />
    </span>

    <ul v-if="parent && parent.children.length > 0 && show" class="list-body">
      <GroupHierarchyList
        v-for="item in parent.children"
        :key="item.id"
        :parent="item"
        :selected-groups="selectedGroups"
        @add-group="setGroupList"
      >
        <LpiCheckbox
          :class="{
            'list-label--has-children': item.children.length > 0,
          }"
          :label="item.name"
          :model-value="!!selectedGroups['#' + item.id]"
          @update:model-value="setGroupList(item.id)"
        />
      </GroupHierarchyList>
    </ul>
  </li>
</template>

<script setup>
import IconImage from '@/components/base/media/IconImage.vue'
import LpiCheckbox from '@/components/base/form/LpiCheckbox.vue'

defineOptions({ name: 'GroupHierarchyList' })
defineProps({
  parent: {
    type: Object,
    default: () => {},
  },

  selectedGroups: {
    type: Object, // map {[groupid]: 'members'|'leaders'|'managers'|false}
    required: true,
  },
})
const emit = defineEmits(['add-group'])
const show = ref(false)
const setGroupList = (groupId) => {
  emit('add-group', groupId)
}
</script>

<style lang="scss" scoped>
.list-body {
  padding: $space-2xs $space-m;

  .header {
    display: inline-flex;
    align-items: center;
  }

  .icon {
    fill: $primary-dark;
    width: pxToRem(20px);
  }
}

.list-label {
  font-size: $font-size-s;

  &--has-children {
    font-weight: 700;
    color: $primary-dark;
  }
}
</style>
