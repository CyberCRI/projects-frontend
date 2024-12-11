<template>
    <div class="section-header-ctn">
        <div class="section-header">
            <span>{{ title }}</span
            >&nbsp;<span v-if="quantity">({{ quantity }})</span>
        </div>

        <SeeMoreArrow
            v-if="hasButton"
            :label="buttonLabel"
            class="section-button"
            @click.prevent="$emit('redirect-button-clicked')"
        />
    </div>
</template>

<script>
import SeeMoreArrow from '@/components/base/button/SeeMoreArrow.vue'

export default {
    name: 'SectionHeader',

    emits: ['redirect-button-clicked'],

    components: {
        SeeMoreArrow,
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
    align-items: flex-end;
    color: $primary-dark;
    fill: $primary-dark;
    margin-bottom: $space-m;

    .section-header {
        display: flex;
        align-items: flex-start;
        font-weight: 700;

        > span {
            font-size: $font-size-l;
        }
    }

    .section-button {
        font-size: $font-size-m;
    }
}
</style>
