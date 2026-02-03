<template>
  <div class="group-recap">
    <component
      :is="is"
      v-for="module in modulesArray"
      :key="module.name"
      class="group-recap-element"
      :class="{
        'reset-btn shadow-box': isLink,
      }"
      @click="isLink && scrollToHash(module.key)"
    >
      <IconImage :name="module.icon" />
      <span class="group-recap-title">
        {{ module.count }}
        {{ module.name }}
      </span>
    </component>
  </div>
</template>

<script setup lang="ts">
import { scrollToHash } from '@/composables/useScrollToTab'
import {
  GroupModuleIcon,
  GroupModuleTitle,
  PeopleGroupModulesKeys,
  TranslatedPeopleGroupModel,
} from '@/models/invitation.model'

const props = withDefaults(
  defineProps<{
    group: TranslatedPeopleGroupModel
    noTitle?: boolean
    modules?: PeopleGroupModulesKeys[]
    isLink?: boolean
  }>(),
  { noTitle: false, modules: null, isLink: false }
)

const { t } = useNuxtI18n()

const is = computed(() => (props.isLink ? 'button' : 'div'))

const modulesArray = computed(() => {
  return (
    Object.entries(props.group.modules)
      // remove modules with 0 elements
      .filter(([name, count]) => {
        return (
          count > 0 &&
          (props.modules === null || props.modules.includes(name as PeopleGroupModulesKeys))
        )
      })
      .map(([name, count]) => {
        const obj = {
          key: name,
          name: props.noTitle ? '' : t(GroupModuleTitle[name]),
          count,
          icon: GroupModuleIcon[name],
        }
        return obj
      })
  )
})
</script>

<style lang="scss" scoped>
.group-recap {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 1rem 0;
}

.group-recap-element {
  display: flex;
  justify-content: center;
  align-items: center;
  color: $primary-dark;
  gap: 0.4rem;
  cursor: pointer;
  border-radius: 10px;
  padding: 0.4rem 0.8rem;

  svg {
    width: 32px;
    fill: $primary;
  }
}

.group-recap-title {
  font-weight: bold;
}
</style>
