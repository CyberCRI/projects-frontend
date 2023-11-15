<template>
    <IconImage v-if="leftIcon && leftIcon !== 'LoaderSimple'" :name="leftIcon" class="left-icon" />
    <LoaderSimple v-if="leftIcon && leftIcon === 'LoaderSimple'" class="left-icon loader" />

    <span v-if="label" data-test="button-label" class="label">{{ label }}</span>

    <IconImage v-if="rightIcon" :name="rightIcon" class="right-icon" :class="buttonSize" />
</template>
<script>
import IconImage from '@/components/svgs/IconImage.vue'
import LoaderSimple from '@/components/lpikit/Loader/LoaderSimple.vue'
export default {
    name: 'ButtonContent',

    components: {
        IconImage,
        LoaderSimple,
    },

    props: {
        label: {
            type: String,
            default: null,
        },

        leftIcon: {
            type: [String, Object],
            default: null,
        },

        rightIcon: {
            type: [String, Object],
            default: null,
        },

        buttonSize: {
            type: String,
            default: 'sbutton',
            validator(value) {
                return ['mbutton', 'sbutton'].includes(value)
            },
        },
    },
}
</script>
<style lang="scss" scoped>
.label {
    display: inline-block;
    text-transform: lowercase;

    &::first-letter {
        text-transform: capitalize;
    }
}

.left-icon {
    height: pxToRem(18px);
}

.right-icon {
    height: pxToRem(18px);

    &.mbutton {
        height: pxToRem(25px);
    }
}

.loader-simple + .left-icon,
.loader-simple + .right-icon,
.loader-simple + .label,
.left-icon + .right-icon,
.left-icon + .label,
.label + .right-icon {
    margin-left: $space-s;
}

.loader-simple {
    width: 22px;
    height: 22px;
    margin-right: $space-s;

    path {
        fill: $primary-dark;
    }
}
</style>
