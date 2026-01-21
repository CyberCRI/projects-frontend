<template>
  <div class="group-recap">
    <NuxtLink
      v-for="module in modules"
      :key="module.name"
      :to="`#${module.key}`"
      class="group-recap-element"
      external
    >
      <IconImage :name="module.icon" />
      <span class="group-recap-title">{{ module.count }} {{ module.name }}</span>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import {
  GroupModuleIcon,
  GroupModuleTitle,
  TranslatedPeopleGroupModel,
} from '@/models/invitation.model'

const props = defineProps<{
  group: TranslatedPeopleGroupModel
}>()

const { t } = useNuxtI18n()

const modules = computed(() => {
  return (
    Object.entries(props.group.modules)
      // remove modules with 0 elements
      .filter(([, count]) => count > 0)
      .map(([name, count]) => {
        const obj = {
          key: name,
          name: t(GroupModuleTitle[name]),
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
  gap: 2rem;
  padding: 1rem 0;
}

.group-recap-element {
  display: flex;
  justify-content: center;
  align-items: center;
  color: $primary-dark;
  gap: 0.4rem;

  svg {
    width: 32px;
    fill: $primary;
  }
}

.group-recap-title {
  font-weight: bold;
}
</style>
