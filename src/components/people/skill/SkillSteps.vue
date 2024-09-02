<template>
    <div :class="{ border: hasBorder, white }" class="container">
        <span
            v-for="(step, index) in steps"
            :key="index"
            :class="{ 'step-completed': step <= activeStep }"
            class="step"
        ></span>
    </div>
</template>

<script>
export default {
    name: 'SkillSteps',

    props: {
        /* eslint-disable-next-line */
        steps: {
            type: Number,
            default: 1,
        },

        /* eslint-disable-next-line */
        activeStep: {
            type: Number,
            default: 1,
        },

        /* eslint-disable-next-line */
        hasBorder: {
            type: Boolean,
            default: false,
        },

        white: {
            type: Boolean,
            default: false,
        },
    },
}
</script>

<style lang="scss" scoped>
.container {
    display: inline-flex;
    padding: $space-m calc($space-l / 1.5);
}

.border {
    border: $border-width-l solid $primary-dark;
    border-radius: 25px;
}

.step {
    height: 10px;
    width: 10px;
    margin-right: 8px;
    background-color: $white;
    border: $border-width-m solid $primary-dark;
    border-radius: 50%;
    display: inline-block;
}

.step-completed {
    background-color: $primary-dark;
}

.step:last-child {
    margin-right: 0;
}

.white {
    .border {
        border: $border-width-l solid $white;
    }

    .step {
        background-color: $primary-dark;
        border: $border-width-m solid $white;
    }

    .step-completed {
        background-color: $white;
    }
}
</style>
