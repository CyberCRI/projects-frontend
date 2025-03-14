<template>
  <li v-show="!group.hidden" class="sub-list">
    <div class="top-list">
      <div class="texts" :class="{ 'has-children': group.children?.length }" @click="showChildren">
        <div>
          <LpiCheckbox
            label=""
            :model-value="selectedGroups[group.id]"
            class="checkbox"
            :disabled="group.disabled"
            @update:model-value="toggleGroup(group)"
            @click.stop
          />
        </div>
        <div class="name" :class="{ 'green-color': hasDisplayableChildren }">
          {{ group.name }}
        </div>

        <div class="icon-td">
          <IconImage
            v-if="hasDisplayableChildren"
            class="icon green-color"
            :name="showChild || forceOpen ? 'ChevronUp' : 'ChevronDown'"
          />
        </div>
      </div>
    </div>
    <div v-show="group.children?.length && (showChild || forceOpen)" class="child-list">
      <ul>
        <MultiGroupPickerElement
          v-for="child in group.children"
          :key="child.id"
          :group="child"
          class="nested-list"
          :selected-groups="selectedGroups"
          :force-open="forceOpen"
          @toggle-group="toggleGroup"
        />
      </ul>
    </div>
  </li>
</template>
<script>
import IconImage from '@/components/base/media/IconImage.vue'
import LpiCheckbox from '@/components/base/form/LpiCheckbox.vue'

export default {
  name: 'MultiGroupPickerElement',

  components: {
    IconImage,
    LpiCheckbox,
  },

  props: {
    group: {
      type: Object,
      required: true,
    },
    selectedGroups: {
      type: Object,
      default: () => ({}),
    },

    forceOpen: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['toggle-group'],

  data() {
    return {
      showChild: false,
    }
  },

  computed: {
    hasDisplayableChildren() {
      return this.group.children?.some((child) => !child.hidden)
    },
  },

  methods: {
    showChildren() {
      this.showChild = !this.showChild
    },
    toggleGroup(group) {
      this.$emit('toggle-group', group)
    },
  },
}
</script>
<style lang="scss" scoped>
.icon-td {
  width: pxToRem(25px);
  padding: $space-xs;
}

.top-list {
  display: flex;
  justify-content: space-between;
}

.sub-list {
  display: flex;
  flex-direction: column;
  width: 100%;
}

li {
  display: flex;
}

.texts {
  display: flex;
  width: 70%;
  align-items: center;

  &.has-children {
    cursor: pointer;
  }
}

.child-list {
  padding-left: pxToRem(35px);
}

.nested-list {
  display: flex;
  justify-content: flex-end;
}

.name {
  padding: $space-unit;
}

.green-color {
  fill: $primary-dark;
  color: $primary-dark;
}

.checkbox {
  margin: 0;
}
</style>
