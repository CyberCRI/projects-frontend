<template>
    <component
        :is="to ? 'router-link' : 'a'"
        class="see-more-arrow"
        :to="to"
        :href="to ? undefined : '#'"
    >
        <span class="label-ctn">{{ label ? label : $t('common.see-more') }}</span>
        <span class="arrow-ctn"><IconImage name="ArrowRight" class="arrow" /></span>
    </component>
</template>
<script>
import IconImage from '@/components/svgs/IconImage.vue'
export default {
    name: 'SeeMoreArrow',

    components: {
        IconImage,
    },

    props: {
        to: {
            default: null,
            validator(value) {
                // use custom validator insted of types to allow null or undefined
                return !value || typeof value === 'string' || typeof value === 'object'
            },
        },
        label: {
            default: null,
            validator(value) {
                // use custom validator insted of types to allow null or undefined
                return !value || typeof value === 'string'
            },
        },
    },
}
</script>
<style lang="scss" scoped>
$icon-size: pxToRem(18px);

.see-more-arrow {
    color: $primary-dark;
    padding: 0 $space-l;
    display: inline-block;
    font-weight: 700;
    cursor: pointer;

    .label-ctn {
        text-transform: lowercase;
        display: inline-block;
        height: $icon-size;

        &::first-letter {
            text-transform: capitalize;
        }
    }

    .arrow-ctn {
        margin-left: $space-s;
        display: inline-block;
        vertical-align: middle;

        .arrow {
            height: $icon-size;
            width: $icon-size;
            fill: $primary-dark;
        }
    }

    &:hover {
        .arrow {
            animation-name: arrowbounce;
            animation-duration: 0.6s;
            animation-timing-function: ease-in-out;
            animation-iteration-count: infinite;
            transform-origin: left center;
        }
    }
}

@keyframes arrowbounce {
    0% {
        transform: scale(1, 1) translateX(0%);
    }

    80% {
        transform: scale(0.7, 1) translateX(100%);
    }

    100% {
        transform: scale(1, 1) translateX(0%);
    }
}
</style>
