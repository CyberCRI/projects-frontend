<script setup>
import { getGroup } from '@/api/groups.service'
import useGlobalsStore from '@/stores/useGlobals.ts'
const props = defineProps({
  groupId: {
    type: String,
    required: true,
  },
})

const globalsStore = useGlobalsStore()

const guardFromPendingEdit = (/*to, from*/) => {
  if (globalsStore.hasUnsavedEdit) {
    const answer = window.confirm('You have unsaved changes! Do you really want to leave?')
    if (answer) globalsStore.hasUnsavedEdit = false
    else return false
  }
}

onBeforeRouteUpdate(guardFromPendingEdit)
onBeforeRouteLeave(guardFromPendingEdit)

try {
  const runtimeConfig = useRuntimeConfig()

  const group = await getGroup(runtimeConfig.public.appApiOrgCode, props.groupId, /*no error*/ true)
  const { image, dimensions } = useImageAndDimension(group?.header_image, 'medium')

  useLpiHead(useRequestURL().toString(), group?.name, group?.description, image, dimensions)
} catch (err) {
  console.log(err)
}
</script>

<template>
  <LazyGroupPageInnerV2 :key="groupId" :group-id="groupId" />
</template>
