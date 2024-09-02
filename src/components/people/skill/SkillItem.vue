<template>
    <div class="skill" :class="{ white }">
        <span>{{ $filters.capitalize(label) }}</span>
        <SkillSteps :white="white" :active-step="level" :steps="steps" class="steps" />
    </div>
</template>
<script>
import SkillSteps from '@/components/people/skill/SkillSteps.vue'

export default {
    name: 'SkillItem',
    components: { SkillSteps },
    props: {
        label: {
            type: String,
            required: true,
        },
        level: {
            type: Number,
            required: true,
        },
        steps: {
            type: Number,
            default: 4,
        },
        white: {
            type: Boolean,
            default: false,
        },
    },
}
</script>
<style lang="scss" scoped>
.skill {
    width: 100%;
    display: inline-flex;
    justify-content: space-between;
    align-items: center;

    span {
        &::first-letter {
            text-transform: capitalize;
        }

        font-size: $font-size-m;
        font-weight: 400;
        color: $black;
    }

    .steps {
        margin: unset;
        flex-grow: unset;
    }
}

.white {
    span {
        color: $white;
    }
}
</style>
