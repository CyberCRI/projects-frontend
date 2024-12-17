<template>
    <div class="skill" :class="{ 'is-open': isOpen, 'no-description': !description?.length }">
        <div class="skill-content">
            <div class="skill-name" @click="isOpen = !isOpen">
                <IconImage class="chevron" :name="isOpen ? 'Minus' : 'Plus'" />
                <span class="skill-title">{{ $filters.capitalize(label) }}</span>
            </div>
            <div class="skill-level">
                <SkillSteps show-label :active-step="level" :steps="steps" class="steps" />
            </div>
            <div class="mentorship">
                <span v-if="skill.can_mentor"> {{ $t('profile.can-mentor') }}</span>
                <span v-if="skill.needs_mentor"> {{ $t('profile.needs-mentor') }}</span>
                <ToolTip
                    v-if="skill.comment && (skill.can_mentor || skill.needs_mentor)"
                    :content="skill.comment"
                    placement="bottom"
                >
                    <LpiButton class="squarish" secondary btn-icon="ChatBubble" label="" />
                </ToolTip>
            </div>
            <div class="actions">
                <LpiButton
                    v-if="skill.can_mentor"
                    class="squarish"
                    secondary
                    btn-icon="EmailOutline"
                    :label="$t('profile.ask-mentorship')"
                    @click="askMentorship"
                />
                <LpiButton
                    v-if="skill.needs_mentor"
                    class="squarish"
                    secondary
                    btn-icon="EmailOutline"
                    :label="$t('profile.offer-mentorship')"
                    @click="offerMentorship"
                />
            </div>
        </div>

        <transition name="open">
            <div v-show="isOpen" class="description">
                <p>{{ description }}</p>
            </div>
        </transition>
        <MentorshipContactDrawer
            :is-open="mentorshipDrawerIsOpen"
            :is-offer="mentorshipDrawerIsOffer"
            @close="mentorshipDrawerIsOpen = false"
        />
    </div>
</template>
<script>
import SkillSteps from '@/components/people/skill/SkillSteps.vue'
import IconImage from '@/components/base/media/IconImage.vue'
import useSkillTexts from '@/composables/useSkillTexts.js'
import LpiButton from '@/components/base/button/LpiButton.vue'
import MentorshipContactDrawer from '@/components/people/skill/MentorshipContactDrawer.vue'
import ToolTip from '@/components/base/ToolTip.vue'
export default {
    name: 'SkillItemFull',
    components: { SkillSteps, IconImage, LpiButton, MentorshipContactDrawer, ToolTip },
    props: {
        skill: {
            type: Object,
            required: true,
        },
        steps: {
            type: Number,
            default: 4,
        },
    },
    setup() {
        const skillTexts = useSkillTexts()
        return { skillTexts }
    },
    data() {
        return {
            isOpen: false,
            mentorshipDrawerIsOpen: false,
            mentorshipDrawerIsOffer: false,
        }
    },

    computed: {
        label() {
            return this.skillTexts.title(this.skill)
        },
        description() {
            return this.skillTexts.description(this.skill)
        },
        level() {
            return Number(this.skill.level)
        },
    },

    methods: {
        askMentorship() {
            this.mentorshipDrawerIsOpen = true
            this.mentorshipDrawerIsOffer = false
        },
        offerMentorship() {
            this.mentorshipDrawerIsOpen = true
            this.mentorshipDrawerIsOffer = true
        },
    },
}
</script>
<style lang="scss" scoped>
.skill {
    width: 100%;
    border-bottom: $border-width-s solid $lighter-gray;
    padding: $space-l 0;

    &.no-description {
        pointer-events: none;
    }

    .skill-name {
        font-weight: 400;
        flex-basis: 30%;
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        cursor: pointer;
    }

    .skill-level {
        flex-basis: 20%;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        gap: $space-m;
    }

    .mentorship {
        flex-basis: 25%;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        gap: $space-m;
    }

    .actions {
        flex-basis: 25%;
        display: flex;
        justify-content: flex-end;
    }
}

.skill-name:hover {
    .chevron {
        fill: $primary-dark;
    }

    .skill-title {
        color: $primary-dark;
    }
}

.skill-content {
    display: flex;
    flex-flow: row nowrap;
    justify-content: stretch;
    gap: $space-unit;
    align-items: center;
}

.chevron {
    flex-shrink: 0;
    width: 1rem;
    transform: scale(1.2) translate(-0.2rem, 0.1rem) rotate(-90deg);
    transition: transform 400ms ease-in-out;
    transform-origin: center;
}

.is-open .chevron {
    transform: scale(1.1) translate(-0.4rem, 0.2rem) rotate(0deg);
}

.skill-title {
    &::first-letter {
        text-transform: capitalize;
    }

    font-size: $font-size-m;
    font-weight: 400;
    color: $black;
}

.summary-content:hover {
    .chevron {
        fill: $primary-dark;
    }

    .skill-title {
        color: $primary-dark;
    }
}

.no-description .chevron {
    fill: $light-gray;
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
