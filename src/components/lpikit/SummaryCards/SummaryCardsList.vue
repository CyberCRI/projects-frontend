<template>
    <div v-if="cards.length > 1" class="summary-cards-list">
        <!-- TO DO
        /> -->
    </div>
    <div v-else-if="cards.length > 0 && cards[0].title === 'projects'">
        <UniqueSummaryCard :title="cards[0].title" :content="cards[0].content" />
    </div>
</template>

<script>
import UniqueSummaryCard from '@/components/lpikit/SummaryCards/UniqueSummaryCard.vue'

export default {
    name: 'SummaryCardsList',

    components: { UniqueSummaryCard },

    props: {
        projects: {
            type: Array,
            default: () => [],
        },
    },

    computed: {
        cards() {
            let array = []
            if (this.projects.length > 0) {
                array.push({
                    title: 'projects',
                    content: this.projects,
                })
            }
            return array
        },
    },
}
</script>
