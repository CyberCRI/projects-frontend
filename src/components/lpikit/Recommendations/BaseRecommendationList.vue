<template>
    <div class="recommendation-list">
        <ul v-if="recommendations.length > 0" class="recommendation-list-container">
            <slot />
        </ul>
        <div v-else class="empty">
            <p class="empty-recommendation">{{ $t('recommendations.empty') }}</p>
        </div>
        <div class="more">
            <LpiButton :label="moreLabel" secondary @click="$emit('goto-more-recommendations')" />
        </div>
    </div>
</template>

<script>
import LpiButton from '@/components/base/button/LpiButton.vue'

export default {
    name: 'BaseRecommendationList',

    emits: ['goto-more-recommendations'],

    components: { LpiButton },

    props: {
        recommendations: {
            type: Array,
            default: () => [],
        },
        moreLabel: {
            type: String,
            default: '',
        },
    },
}
</script>

<style lang="scss" scoped>
.recommendation-list {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-block: $space-m;
}

.recommendation-list-container {
    width: 100%;
}

.empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: $space-l;
}

.more {
    margin-block: $space-s;
}
</style>
