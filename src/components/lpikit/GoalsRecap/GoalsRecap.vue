<template>
    <div class="goals-recap">
        <div class="goals-header">
            <h4>
                {{ $t('goal.goals') }} <span>x {{ filteredGoals.length }}</span>
            </h4>

            <LpiButton left-icon="ArrowRight" size="small" />
        </div>

        <div v-if="filteredGoals.length" class="goals-ctn">
            <Goal
                v-for="(goal, index) in filteredGoals"
                :key="index"
                :goal="goal"
                class="goal"
                @click="$emit('access-goals-view')"
            />
        </div>
    </div>
</template>

<script>
import Goal from './Goal.vue'
import LpiButton from '@/components/lpikit/LpiButton/LpiButton.vue'

export default {
    name: 'GoalsRecap',

    emits: ['access-goals-view'],

    components: { Goal, LpiButton },

    props: {
        goals: {
            type: Array,
            required: true,
        },
    },

    computed: {
        filteredGoals() {
            return this.goals.filter(
                (goal) => goal.status && (goal.status === 'complete' || goal.status === 'ongoing')
            )
        },
    },
}
</script>

<style lang="scss" scoped>
.goals-recap {
    width: fit-content;

    .goals-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 pxToRem(20px) pxToRem(10px);
        width: 100%;

        h4 {
            color: $primary-dark;
            font-size: $font-size-m;
            font-weight: 700;

            span {
                font-size: $font-size-xs;
            }
        }
    }

    .goals-ctn {
        .goal:not(:first-child) {
            margin-top: pxToRem(4px);
        }
    }
}
</style>
