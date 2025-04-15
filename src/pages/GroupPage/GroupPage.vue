<script setup>
import { LazyGroupPageInner } from '#components'
import { getGroup } from '@/api/groups.service'
const props = defineProps({
  groupId: {
    type: String,
    required: true,
  },
})

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
  <LazyGroupPageInner :key="groupId" :group-id="groupId" />
</template>
