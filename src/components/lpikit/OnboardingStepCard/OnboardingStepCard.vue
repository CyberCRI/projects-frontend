<template>
    <div class="onboarding-step-card" :class="{ disabled }">
        <div class="onboarding-content">
            <span class="step-number">{{ `${$t('onboarding.step')} ${activeStep}` }}</span>

            <h3>{{ stepTitle }}</h3>

            <SkillSteps :steps="5" :active-step="activeStep" />
        </div>

        <button>
            <span>{{ buttonLabel }}</span>
            <IconImage name="ArrowRight" />
        </button>
    </div>
</template>

<script>
import IconImage from '@/components/svgs/IconImage.vue'
import SkillSteps from '@/components/lpikit/Steps/SkillSteps.vue'

export default {
    name: 'OnboardingStepCard',

    components: { IconImage, SkillSteps },

    props: {
        stepTitle: {
            type: String,
            default: '',
        },

        buttonLabel: {
            type: String,
            default: '',
        },

        activeStep: {
            type: Number,
            default: 1,
        },

        disabled: {
            type: Boolean,
            default: false,
        },
    },
}
</script>

<style lang="scss" scoped>
.onboarding-step-card {
    border-radius: $border-radius-l;
    border: $border-width-l solid $primary-dark;
    background: $white;
    overflow: hidden;
    max-width: 300px;

    .onboarding-content {
        padding: $space-l $space-l $space-m;

        .step-number {
            text-transform: uppercase;
            color: $primary-dark;
            font-size: $font-size-xs;
            font-weight: bold;
        }

        h3 {
            color: $black;
            font-size: $font-size-xl;
            font-weight: bold;
            margin: $space-m 0 $space-s;
        }
    }

    button {
        background-color: $white;
        border: none;
        display: flex;
        align-items: center;
        justify-content: center;
        color: $primary-dark;
        font-weight: bold;
        border-top: 3px solid $primary-dark;
        width: 100%;
        height: 50px;
        font-size: $font-size-m;
        will-change: transform;
        transition: 0.15s color ease-in-out;
        cursor: pointer;

        svg {
            fill: $primary-dark;
            height: 18px;
            margin-left: $space-s;
            transition: 0.15s fill ease-in-out;
        }

        &::after {
            background: $primary-dark;
            border-bottom-left-radius: pxToRem(16px);
            border-bottom-right-radius: pxToRem(16px);
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            height: 100%;
            width: 100%;
            transform: translate(-100%, 0);
            transform-origin: left;
            transition: 0.15s all ease-in-out;
            will-change: transform;
            z-index: -1;
        }

        &:hover {
            color: $white;

            svg {
                fill: $white;
            }

            &::after {
                transform: translate(0, 0);
            }
        }
    }

    &.disabled {
        opacity: 0.5;

        button {
            cursor: initial;

            &::after {
                display: none;
            }

            &:hover {
                color: $primary-dark;

                svg {
                    fill: $primary-dark;
                }
            }
        }
    }
}
</style>
