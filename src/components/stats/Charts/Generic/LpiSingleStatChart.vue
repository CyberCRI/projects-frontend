<template>
    <div class="total-container">
        <span class="projects-count">{{ chartData }}</span> <span class="projects-word">{{ $t('stats.projects') }}</span>
    </div>
</template>

<script>
export default {
    name: 'LpiSingleStatChart',
    props: {
        chartData: {
            type: Number,
            default: null,
        },
    },
}
</script>

<style lang="scss" scoped>
.total-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .projects-count {
        font-size: 7rem;
        font-weight: 700;
        color: $primary-dark;
        margin-bottom: -10px;
    }

    .projects-word {
        font-size: 1.5rem;
        font-weight: 700;
        color: $salmon;
    }
}
</style>
