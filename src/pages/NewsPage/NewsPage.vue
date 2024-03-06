<template>
    <div class="news-list-page page-section-medium">
        <h1 class="page-title">NEWS {{ slugOrId }}</h1>
        <BreadCrumbs :breadcrumbs="breadcrumbs" />
    </div>
</template>
<script>
import BreadCrumbs from '@/components/lpikit/BreadCrumbs/BreadCrumbs.vue'
export default {
    name: 'NewsPage',

    components: {
        BreadCrumbs,
    },
    props: {
        slugOrId: {
            type: String,
            required: true,
        },
    },

    computed: {
        breadcrumbs() {
            return [
                {
                    name: 'News',
                    route: { name: 'NewsListPage' },
                },
            ]
        },
    },
}
</script>
<style lang="scss" scoped>
.page-title {
    margin-top: pxToRem(60px);
    margin-bottom: pxToRem(60px);
}
</style>
