<template>
    <div class="section-header-ctn">
        <div class="section-header">
            <span>{{ title }}</span
            >&nbsp;<span v-if="quantity">({{ quantity }})</span>
        </div>

        <LpiButton
            v-if="hasButton"
            :label="$filters.capitalize(buttonLabel ? buttonLabel : null)"
            :left-icon="buttonLabel ? null : 'ArrowRight'"
            :right-icon="buttonLabel ? 'ArrowRight' : null"
            class="section-button"
            size="link"
            @click="$emit('redirect-button-clicked')"
        />
    </div>
</template>

<script>
import LpiButton from '@/components/lpikit/LpiButton/LpiButton.vue'

export default {
    name: 'SectionHeader',

    emits: ['redirect-button-clicked'],

    components: {
        LpiButton,
    },

    props: {
        title: {
            type: String,
            default: '',
        },

        buttonLabel: {
            type: String,
            default: null,
        },

        quantity: {
            type: Number,
            default: null,
        },

        hasButton: {
            type: Boolean,
            default: true,
        },
    },
}
</script>

<style lang="scss" scoped>
.section-header-ctn {
    display: flex;
    align-items: center;
    color: $primary-dark;
    fill: $primary-dark;
    margin-bottom: $space-m;

    .section-header {
        display: flex;
        align-items: flex-start;
        font-weight: 700;

        > span {
            font-size: $font-size-l;
            line-height: pxToRem(24px);
        }
    }

    .section-button {
        font-size: 16px;
        line-height: 18px;
    }
}
</style>
