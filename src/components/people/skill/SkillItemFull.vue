<template>
    <div class="skill" :class="{ 'is-open': isOpen, 'no-description': !description?.length }">
        <div class="skill-content">
            <div class="skill-name" @click="isOpen = !isOpen">
                <div class="skill-title">
                    <IconImage class="chevron" :name="isOpen ? 'Minus' : 'Plus'" />
                    <span class="skill-title">{{ $filters.capitalize(label) }}</span>
                </div>
                <transition name="open">
                    <div v-show="isOpen" class="description mobile">
                        <p>{{ description }}</p>
                    </div>
                </transition>
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
                <template v-if="skill.can_mentor">
                    <span class="mentorship-offering" v-if="isSelf">
                        {{ $t('profile.mentorship-offering') }}
                    </span>
                    <span class="mentorship-asked" v-else-if="hasAskedMentorship">{{
                        $t('profile.mentorship-asked')
                    }}</span>
                    <NeedLoginToolTip v-else>
                        <template #default="{ needLogin }">
                            <LpiButton
                                v-if="skill.can_mentor"
                                class="squarish"
                                :disabled="needLogin"
                                secondary
                                btn-icon="EmailOutline"
                                :label="$t('profile.ask-mentorship')"
                                @click="askMentorship(needLogin)"
                            />
                        </template>
                    </NeedLoginToolTip>
                </template>
                <template v-if="skill.needs_mentor">
                    <span class="mentorship-asking" v-if="isSelf">
                        {{ $t('profile.mentorship-asking') }}
                    </span>
                    <span class="mentorship-offered" v-else-if="hasOfferedMentorship">{{
                        $t('profile.mentorship-offered')
                    }}</span>
                    <NeedLoginToolTip v-else>
                        <template #default="{ needLogin }">
                            <LpiButton
                                class="squarish"
                                :disabled="needLogin"
                                secondary
                                btn-icon="EmailOutline"
                                :label="$t('profile.offer-mentorship')"
                                @click="offerMentorship(needLogin)"
                            />
                        </template>
                    </NeedLoginToolTip>
                </template>
            </div>
        </div>

        <transition name="open">
            <div v-show="isOpen" class="description desktop">
                <p>{{ description }}</p>
            </div>
        </transition>
        <MentorshipContactDrawer
            :skill="skill"
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
import NeedLoginToolTip from '@/components/base/NeedLoginToolTip.vue'
export default {
    name: 'SkillItemFull',
    components: {
        SkillSteps,
        IconImage,
        LpiButton,
        MentorshipContactDrawer,
        ToolTip,
        NeedLoginToolTip,
    },
    props: {
        skill: {
            type: Object,
            required: true,
        },
        steps: {
            type: Number,
            default: 4,
        },
        hasAskedMentorship: {
            type: Boolean,
            default: false,
        },
        hasOfferedMentorship: {
            type: Boolean,
            default: false,
        },
        isSelf: {
            type: Boolean,
            default: false,
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
        askMentorship(prevent) {
            if (!prevent) {
                this.mentorshipDrawerIsOpen = true
                this.mentorshipDrawerIsOffer = false
            }
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

    .skill-content {
        display: flex;
        flex-flow: row nowrap;
        justify-content: stretch;
        gap: $space-unit;
        align-items: center;

        @media screen and (max-width: $min-tablet) {
            flex-flow: column nowrap;
            align-items: flex-start;
        }
    }

    &.no-description {
        pointer-events: none;
    }

    .skill-name {
        flex-basis: 25%;
        flex-shrink: 0;
        display: flex;
        flex-flow: column nowrap;
        justify-content: flex-start;
        align-items: flex-start;
    }

    .skill-title {
        font-weight: 400;
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

        @media screen and (max-width: $min-tablet) {
            .container {
                padding-left: 0 !important;
            }
        }
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

    .skill-level,
    .mentorship,
    .actions {
        @media screen and (max-width: $min-tablet) {
            padding-left: 1rem;
        }
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
    padding-top: $space-m;
    padding-left: 1rem;
    border-left: 1px solid $light-gray;
    align-self: flex-start;

    @media screen and (min-width: $max-tablet) {
        padding-right: calc(60%);
        margin-right: #{4 * $space-m};
    }

    &.mobile {
        display: none;

        @media screen and (max-width: $min-tablet) {
            display: block;
        }
    }

    &.desktop {
        display: block;

        @media screen and (max-width: $min-tablet) {
            display: none;
        }
    }
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

.mentorship-offering,
.mentorship-asking,
.mentorship-offered,
.mentorship-asked {
    font-style: italic;
    font-weight: 400;
    color: $primary-dark;
}
</style>
