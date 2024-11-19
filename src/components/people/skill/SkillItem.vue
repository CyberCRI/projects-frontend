<template>
    <div class="skill" :class="{ 'is-open': isOpen }">
        <div class="summary-content" @click="isOpen = !isOpen">
            <IconImage class="chevron" name="MenuDown" />
            <span class="skill-title">{{ $filters.capitalize(label) }}</span>
            <SkillSteps :active-step="level" :steps="steps" class="steps" />
        </div>

        <transition name="open">
            <div v-show="isOpen" class="description">
                <p>{{ description }}</p>
            </div>
        </transition>
    </div>
</template>
<script>
import SkillSteps from '@/components/people/skill/SkillSteps.vue'
import IconImage from '@/components/base/media/IconImage.vue'

export default {
    name: 'SkillItem',
    components: { SkillSteps, IconImage },
    props: {
        label: {
            type: String,
            required: true,
        },
        description: {
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
    },
    data() {
        return {
            isOpen: false,
        }
    },
}
</script>
<style lang="scss" scoped>
.skill {
    width: 100%;
}

.summary-content {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    cursor: pointer;
}

.chevron {
    flex-shrink: 0;
    width: 1rem;
    transform: scale(2) translate(-0.2rem, 0.1rem) rotate(-90deg);
    transition: all 400ms ease-in-out;
    transform-origin: center;
}

.is-open .chevron {
    transform: scale(2) translateX(-0.2rem) rotate(0deg);
}

.skill-title {
    &::first-letter {
        text-transform: capitalize;
    }

    font-size: $font-size-m;
    font-weight: 400;
    color: $black;
}

.summary-content:hover .skill-title {
    color: $primary-dark;
}

.steps {
    margin: unset;
    margin-left: auto;
    flex-grow: unset;
    padding: 0.35rem 1rem;
    align-self: center;
}

.description {
    font-size: $font-size-s;
    padding-left: 1rem;
    border-left: 1px solid $light-gray;
    align-self: flex-start;
}

.open-enter-active {
    transition: all 200ms ease-in-out;
    transform-origin: top;

    p {
        transition: all 200ms ease-in-out;
        transition-delay: 200ms;
    }
}

.open-leave-active {
    transition: all 200ms ease-in-out;
    transition-delay: 200ms;
    transform-origin: top;

    p {
        transition: all 200ms ease-in-out;
    }
}

.open-enter-from,
.open-leave-to {
    transform: scaleY(0);

    p {
        opacity: 0;
    }
}

.open-enter-to,
.open-leave-from {
    transform: scaleY(1);

    p {
        opacity: 1;
    }
}
</style>
