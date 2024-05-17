<template>
    <div class="goals-recap">
        <SectionHeader
            :button-label="$filters.capitalize($t('common.see-more'))"
            :quantity="goals.length"
            :title="$filters.capitalize($t('goal.goals'))"
            class="section-header"
            @redirect-button-clicked="goToGoalPage"
        />

        <div v-if="goals.length" class="goals-ctn">
            <GoalSummaryItem
                v-for="(goal, index) in goals"
                :key="index"
                :goal="goal"
                class="goal"
                @click="$emit('access-goals-view')"
            />
        </div>
    </div>
</template>

<script>
import GoalSummaryItem from '@/components/project/goal/GoalSummaryItem.vue'
import SectionHeader from '@/components/base/SectionHeader.vue'

export default {
    name: 'GoalsRecap',

    emits: ['access-goals-view'],

    components: { GoalSummaryItem, SectionHeader },

    props: {
        goals: {
            type: Array,
            required: true,
        },
    },

    methods: {
        goToGoalPage() {
            this.$router.push({
                name: 'projectGoals',
                params: { slugOrId: this.$route.params.slugOrId },
                hash: '#tab',
            })
        },
    },
}
</script>

<style lang="scss" scoped>
.goals-recap {
    border: $border-width-s solid $green;
    border-radius: $border-radius-l;
    padding: $space-l;
    background: $primary-lighter;
}

.goals-recap .goal:not(:first-child) {
    margin-top: pxToRem(12px);
}
</style>

<style lang="scss">
.goals-recap .section-header .s-button {
    text-transform: uppercase;
}
</style>
