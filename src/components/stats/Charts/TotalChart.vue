<template>
    <div class="container">
        <LpiSingleStatChart :chart-data="stats" />
    </div>
</template>

<script>
import LpiSingleStatChart from './Generic/LpiSingleStatChart.vue';

export default {
    name: 'TotalChart',

    components: { LpiSingleStatChart },

    props: {
        stats: {
            type: Array,
            default: () => [],
        },
    },
}
</script>

<style lang="scss" scoped>
.container {
    width: 100%;
    height: 100%;
}
</style>
