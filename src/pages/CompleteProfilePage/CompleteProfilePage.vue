<template>
    <CompleteProfileDrawer :is-opened="true" />
</template>
<script>
import CompleteProfileDrawer from '@/components/lpikit/CompleteProfileDrawer/CompleteProfileDrawer.vue'
export default {
    name: 'CompleteProfilePage',
    components: { CompleteProfileDrawer },
}
</script>
