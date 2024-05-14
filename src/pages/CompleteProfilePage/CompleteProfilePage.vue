<template>
    <CompleteProfileDrawer :is-opened="true" />
</template>
<script>
import CompleteProfileDrawer from '@/components/people/CompleteProfileDrawer/CompleteProfileDrawer.vue'
export default {
    name: 'CompleteProfilePage',
    components: { CompleteProfileDrawer },
}
</script>
