<template>
    <div class="onboarding-todo">
        <span class="todo-label">{{ todoLabel }}</span>
        <ToolTip arrow class="color-tip" :interactive="true" :hover="true">
            <button class="question-mark tooltip">
                <IconImage name="QuestionMark" />
            </button>
            <template #custom-content>
                <div class="tooltip-div">
                    <slot></slot>
                </div>
            </template>
        </ToolTip>
        <span class="toto-state" :class="{ done: todoDone }">
            <IconImage class="checkmark" name="Check" />
        </span>
    </div>
</template>
<script>
import IconImage from '@/components/svgs/IconImage.vue'
import ToolTip from '@/components/lpikit/ToolTip/ToolTip.vue'
export default {
    name: 'OnboardingTodo',

    components: {
        IconImage,
        ToolTip,
    },

    props: {
        todoLabel: {
            type: String,
            required: true,
        },
        todoDone: {
            type: Boolean,
            required: true,
        },
    },
}
</script>
<style lang="scss" scoped>
.onboarding-todo {
    flex-basis: 25%;
    display: flex;
    align-items: center;
    gap: $space-m;
    background-color: $white;
    padding: $space-m $space-unit;
    border: $dark-blue solid $border-width-s;
    border-radius: $border-radius-8;
}

.todo-label {
    font-weight: 700;
}

$checkbox-size: pxToRem(20px);

.toto-state {
    margin-left: auto;
    width: $checkbox-size;
    height: $checkbox-size;
    border: $border-width-m solid $primary-dark;
    border-radius: $border-radius-xs;
    flex-shrink: 0;

    .checkmark {
        display: none;
        object-fit: contain;
        fill: $white;
    }

    &.done {
        background-color: $primary-dark;

        .checkmark {
            display: inline-block;
        }
    }
}

$question-mark-size: pxToRem(20px);

.question-mark {
    appearance: none;
    display: inline-block;
    position: relative;
    width: $question-mark-size;
    height: $question-mark-size;
    background-color: $white;
    vertical-align: text-top;
    margin-left: $space-m;
    border-radius: 100%;
    border: $primary-dark solid $border-width-s;
    cursor: pointer;

    svg {
        width: 100%;
        fill: $primary-dark;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
}

.color-tip {
    color: $black !important;
}

.tooltip-div {
    max-width: 20rem;
    white-space: break-spaces;
    padding: $space-m;
    text-align: center;
    line-height: 1.3;
    color: $black;
}
</style>
