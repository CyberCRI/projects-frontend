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
              @click="emit('move', group)"
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

<script setup lang="ts">
import type { HierarchyGroupModel } from 'shared-projects-frontend/models'
import IconImage from '~/components/base/media/IconImage.vue'

defineProps<{
  group: HierarchyGroupModel
}>()

const router = useRouter()
const emit = defineEmits(['move', 'add', 'edit'])
const showChild = ref(false)

const showChildren = () => (showChild.value = !showChild.value)
const goTo = (group) => {
  router.push({
    name: 'Group',
    params: { groupIdOrSlug: group.slug || group.id },
  })
}
const addGroup = (group) => emit('add', group)
const editGroup = (group) => emit('edit', group)
const moveGroup = (group) => emit('move', group)
</script>
<style lang="scss" scoped>
@use '~/design/scss/variables';

.top-list {
  display: flex;
  justify-content: space-between;
  border-bottom: solid variables.$lighter-gray 1px;
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
  padding-left: variables.pxToRem(35px);
}

.nested-list {
  display: flex;
  justify-content: flex-end;
}

.icon-td {
  width: variables.pxToRem(25px);
  padding: 7px;
}

.name {
  padding: variables.$space-unit;
}

.green-color {
  fill: variables.$primary-dark;
}

.clickable {
  cursor: pointer;
}

.grey-color {
  fill: variables.$lighter-gray;
}

.green-text {
  color: variables.$primary-dark;
}

.black-text {
  color: variables.$almost-black;
  font-weight: 400;
}
</style>
