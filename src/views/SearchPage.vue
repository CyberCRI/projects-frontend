<template>
    <BrowseLayout :key="$route.name"></BrowseLayout>
</template>

<script>
import BrowseLayout from '@/components/Layouts/Search/BrowseLayout.vue'
/**
 * WARNING: do not remove ":key="$route.name"" on line 2
 * or it will break BrowseLayout initialization
 * since the component is reused on many routes
 */
export default {
    name: 'SearchPage',
    components: { BrowseLayout },

    mounted() {
        this.$store.dispatch('app/updateLoading', { visible: false })
    },
}
</script>
