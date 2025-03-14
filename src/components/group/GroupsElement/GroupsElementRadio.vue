<template>
  <li class="sub-list">
    <div class="top-list">
      <div class="texts">
        <label class="form-control">
          <input
            class="name green-text"
            :class="{ disabled: isDisabled }"
            :value="group.id"
            name="group_id"
            type="radio"
            :checked="group.id === initialGroup?.id"
            :disabled="isDisabled"
            :data-test="`group-${group.id}`"
            @change="setGroup(group)"
          />

          <span
            :class="{
              'has-children': group.children && group.children.length > 0,
              'searched-group': listGroupsIds.includes(group.id),
            }"
          >
            {{ group.name }}
          </span>
        </label>
        <div
          v-if="group.children && group.children.length > 0"
          class="icon-td green-color clickable"
        >
          <IconImage
            class="icon"
            :name="showChild ? 'ChevronUp' : 'ChevronDown'"
            @click="showChildren"
          />
        </div>
        <div v-else class="no-icon" />
      </div>
    </div>
    <div v-if="group.children && group.children.length && showChild">
      <ul class="child-list-ctn">
        <GroupsElementRadio
          v-for="childGroup in group.children"
          :key="childGroup.id"
          :group="childGroup"
          class="nested-list"
          name="childGroup"
          :parents="parents"
          :initial-group="initialGroup"
          :list-groups-ids="listGroupsIds"
          :forbidden-ids="forbiddenIds"
          @set-group="setGroup"
        />
      </ul>
    </div>
  </li>
</template>

<script>
import IconImage from '@/components/base/media/IconImage.vue'

export default {
  name: 'GroupsElementRadio',
  components: {
    IconImage,
  },
  props: {
    group: {
      // current group
      type: Object,
      required: true,
    },

    parents: {
      // array of pre-opened groups ids
      type: Array,
      required: false,
      default: () => [],
    },
    listGroupsIds: {
      // array of groups ids that are searched (highlighted)
      type: Array,
      required: false,
      default: () => [],
    },

    initialGroup: {
      // initialy selected group
      type: Object,
      required: false,
      default: null,
    },
    forbiddenIds: {
      // array of unselectable groups
      type: Array,
      required: false,
      default: () => [],
    },
  },
  emits: ['set-group', 'select-group'],
  data() {
    return {
      showChild: false,
    }
  },
  computed: {
    isDisabled() {
      return this.forbiddenIds && this.forbiddenIds.includes(this.group.id)
    },
  },
  watch: {
    parents: {
      handler: function (neo) {
        if (neo.includes(this.group.id)) {
          this.showChild = true
        } else {
          this.showChild = false
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    showChildren() {
      this.showChild = !this.showChild
    },
    setGroup(group) {
      // cant use isDisabled here as it based on current group
      // and we might want to push event from a child group
      // that is not disabled whereas the current on is
      if (!this.forbiddenIds || !this.forbiddenIds.includes(group.id)) {
        this.$emit('set-group', group)
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.form-control {
  display: flex;
  align-items: center;
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

.child-list-ctn {
  margin-left: $space-l;
}

li {
  display: flex;
  width: 100%;
}

.texts {
  display: flex;
  width: 100%;
  align-items: center;
}

input[type='radio'] {
  /* remove standard background appearance */
  appearance: none;

  /* create custom radiobutton appearance */
  display: inline-block;
  width: 18px;
  height: 18px;
  padding: 3px;

  /* background-color only for content */
  background-clip: content-box;
  border: 2px solid $primary-dark;
  background-color: $white;
  border-radius: 50%;

  &.disabled {
    border-color: $lighter-gray;
  }
}

/* appearance for checked radiobutton */
input[type='radio']:checked {
  background-color: $primary-dark;
}

.nested-list {
  display: flex;
  justify-content: flex-end;
}

.icon-td {
  width: pxToRem(25px);
  padding: 7px;
}

.no-icon {
  width: 32px;
  height: 32px;
}

.name {
  padding: $space-unit;
  margin: 8px;
}

.searched-group {
  background-color: $primary;
}

.has-children {
  color: $primary-dark;
  font-weight: 700;
}

.green-color {
  fill: $primary-dark;
}

.clickable {
  cursor: pointer;
}

.green-text {
  color: $primary-dark;
}

.black-text {
  color: $almost-black;
  font-weight: 400;
}
</style>
