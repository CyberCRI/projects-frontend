<template>
  <ul>
    <li class="sub-list">
      <div class="top-list">
        <div class="texts" @click="showChildren">
          <div
            class="icon-td"
            :class="{
              'green-color': group.children?.length,
              clickable: group.children?.length,
              'grey-color': !group.children?.length,
            }"
          >
            <IconImage class="icon" name="ChevronRight" />
          </div>

          <div
            class="name"
            :class="{
              'green-text': group.children?.length,
              'black-text': !group.children?.length,
            }"
          >
            {{ group.name }}
          </div>
        </div>
        <div class="icons">
          <div class="icon-td">
            <IconImage
              class="icon green-color clickable"
              name="FileTreeOutline"
              @click="emits('move', group)"
            />
          </div>
          <div class="icon-td">
            <IconImage class="icon green-color clickable" name="Pen" @click="editGroup(group)" />
          </div>
          <div class="icon-td">
            <IconImage class="icon green-color clickable" name="Eye" @click="goTo(group)" />
          </div>
        </div>
      </div>
      <div v-if="group.children && showChild" class="child-list">
        <GroupsElement
          v-for="child in group.children"
          :key="child.id"
          :group="child"
          class="nested-list"
          @add="addGroup"
          @edit="editGroup"
          @move="moveGroup"
        />
      </div>
    </li>
  </ul>
</template>
<script setup>
import IconImage from '@/components/base/media/IconImage.vue'

defineOptions({ name: 'GroupsElement' })

defineProps({
  group: {
    type: Object,
    required: true,
  },
})

const router = useRouter()
const emits = defineEmits(['move', 'add', 'edit'])
const showChild = ref(false)

const showChildren = () => (showChild.value = !showChild.value)
const goTo = (group) => {
  router.push({ name: 'Group', params: { groupId: group.slug || group.id } })
}
const addGroup = (group) => emits('add', group)
const editGroup = (group) => emits('edit', group)
const moveGroup = (group) => emits('move', group)
</script>
<style lang="scss" scoped>
.top-list {
  display: flex;
  justify-content: space-between;
  border-bottom: solid $lighter-gray 1px;
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
  cursor: pointer;
}

.icons {
  display: flex;
}

.child-list {
  padding-left: pxToRem(35px);
}

.nested-list {
  display: flex;
  justify-content: flex-end;
}

.icon-td {
  width: pxToRem(25px);
  padding: 7px;
}

.name {
  padding: $space-unit;
}

.green-color {
  fill: $primary-dark;
}

.clickable {
  cursor: pointer;
}

.grey-color {
  fill: $lighter-gray;
}

.green-text {
  color: $primary-dark;
}

.black-text {
  color: $almost-black;
  font-weight: 400;
}
</style>
