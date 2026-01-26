<template>
  <GroupMemberItem :member="user" :role-label="roleLabel" @click="removeMember">
    <template #actions>
      <div v-if="iconName" class="icon">
        <IconImage :name="iconName" @click="removeMember" />
      </div>
    </template>
  </GroupMemberItem>
</template>

<script setup lang="ts">
import IconImage from '@/components/base/media/IconImage.vue'
import useUsersStore from '@/stores/useUsers'
import GroupMemberItem from '@/components/group/Modules/Members/GroupMemberItem.vue'
import { GroupMember } from '@/models/group.model'
import { IconImageChoice } from '@/functs/IconImage'

const props = withDefaults(
  defineProps<{
    user: GroupMember
    icon?: IconImageChoice
    roleLabel?: string
  }>(),
  { icon: null, roleLabel: null }
)

const emit = defineEmits(['click'])
const usersStore = useUsersStore()

const iconName = computed(() => {
  if (props.icon) return props.icon
  return props.user.id !== usersStore.userFromApi.id ? 'Close' : null
})

const removeMember = () => {
  if (props.icon) {
    emit('click')
  }
}
</script>

<style lang="scss" scoped>
.team-card-small {
  display: flex;
  align-items: center;
  padding: $space-l $space-m;
  box-sizing: border-box;
  border: $border-width-s solid $primary;
  border-radius: $border-radius-m;
  background-color: $white;
  height: pxToRem(118px);
  color: $black;
  position: relative;
  justify-content: space-between;
  cursor: pointer;

  &.passive {
    cursor: default;
    pointer-events: none;
  }

  .user-container {
    display: flex;
    align-items: center;
  }

  .img-container {
    border-radius: 50%;
    background-size: cover;
    background-position: top center;
    width: pxToRem(48px);
    height: pxToRem(48px);
    flex-shrink: 0;
  }

  .user-info {
    margin-left: $space-m;
    flex-grow: 1;

    .title {
      font-size: $font-size-xs;
      font-weight: 400;
    }
  }

  .lpi-button {
    flex-shrink: 0;
  }

  .icon {
    fill: $primary-dark;
    border: $border-width-s solid $primary-dark;
    width: pxToRem(16px);
    height: pxToRem(16px);
    position: absolute;
    right: 2px;
    top: 2px;
    border-radius: $border-radius-50;
    cursor: pointer;
  }

  .name {
    font-weight: 700;
    font-size: $font-size-s;
    margin-bottom: $space-m;
  }

  .role {
    background: $primary;
    color: $black;
    font-size: $font-size-s;
    font-weight: 700;
    display: inline-block;
    padding: $space-2xs $space-xs;
    margin-bottom: $space-m;
  }
}
</style>
