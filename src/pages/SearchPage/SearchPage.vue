<template>
    <BrowseLayout :key="$route.name"></BrowseLayout>
</template>

<script>
import BrowseLayout from '@/components/lpikit/BrowseLayout/BrowseLayout.vue'
/**
 * WARNING: do not remove ":key="$route.name"" on line 2
 * or it will break BrowseLayout initialization
 * since the component is reused on many routes
 */
export default {
    name: 'SearchPage',
    components: { BrowseLayout },
}
</script>
