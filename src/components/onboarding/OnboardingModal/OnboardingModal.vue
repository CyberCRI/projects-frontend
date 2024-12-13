<template>
    <div class="onboarding-modal">
        <BaseModal
            :is-small="true"
            :has-topping="true"
            :has-button-1="activeStep > 1"
            :has-button-2="activeStep < stepNumber"
        >
            <template #topping>
                <SkillSteps
                    class="onboarding-modal-steps"
                    :steps="stepNumber"
                    :active-step="activeStep"
                    :has-border="true"
                />
            </template>

            <template #dismiss-button="{ close }">
                <LpiButton label="SKIP" @click="close()"></LpiButton>
            </template>

            <template #content>
                <slot name="step-content" :step="activeStep"></slot>
            </template>

            <template #footer>
                <div class="button-wrapper" :class="{ 'has-both-buttons': hasBothButtons }">
                    <LpiButton
                        v-show="hasPrevious"
                        class="button-footer"
                        :label="$t('onboarding-modal.previous')"
                        btn-icon="Previous"
                        :secondary="true"
                        @click="previous()"
                    >
                    </LpiButton>
                </div>
                <div class="button-wrapper" :class="{ 'has-both-buttons': hasBothButtons }">
                    <LpiButton
                        v-show="hasNext"
                        class="button-footer"
                        :label="$t('onboarding-modal.next')"
                        btn-icon="Next"
                        :reversed-order="true"
                        :secondary="true"
                        @click="next()"
                    >
                    </LpiButton>
                </div>
            </template>
        </BaseModal>
    </div>
</template>

<script>
import BaseModal from '@/components/base/modal/BaseModal.vue'
import SkillSteps from '@/components/people/skill/SkillSteps.vue'
import LpiButton from '@/components/base/button/LpiButton.vue'

export default {
    name: 'OnboardingModal',

    emits: ['stepped'],

    components: { BaseModal, SkillSteps, LpiButton },

    props: {
        stepNumber: {
            type: Number,
            default: 1,
        },

        initialStep: {
            type: Number,
            default: 1,
        },
    },

    data() {
        return {
            activeStep: this.initialStep,
        }
    },

    methods: {
        previous() {
            if (this.activeStep > 1) {
                this.activeStep--
                this.$emit('stepped', this.activeStep)
            }
        },
        next() {
            if (this.activeStep < this.stepNumber) {
                this.activeStep++
                this.$emit('stepped', this.activeStep)
            }
        },
    },

    computed: {
        hasPrevious() {
            return this.activeStep > 1
        },
        hasNext() {
            return this.activeStep < this.stepNumber
        },
        hasBothButtons() {
            return this.hasPrevious && this.hasNext
        },
    },
}
</script>

<style lang="scss" scoped>
.onboarding-modal {
    .onboarding-modal-steps {
        background-color: $white;
        margin-left: 0; /* fix modal topping centering for steps, see negative margin in Steps component */
    }

    .navigation-icon {
        height: 1em;
    }

    .modal-footer {
        display: flex;
        place-content: space-between center;

        button {
            cursor: pointer;
        }
    }

    .button-wrapper {
        flex: 0 0 50%;
        border: none;
        border-top: 3px solid $primary-dark;
    }

    .has-both-buttons {
        &.button-wrapper:first-child {
            border-right: 2px solid $primary-dark;
        }

        &.button-wrapper:last-child {
            border-left: 2px solid $primary-dark;
        }
    }

    .button-footer {
        color: $primary-dark;
        background: $white;
        width: 100%;
        padding: $space-m 0;
        font-weight: 700;
        border: none;

        svg path {
            stroke: $primary-dark;
            fill: $primary-dark;
        }
    }
}
</style>
