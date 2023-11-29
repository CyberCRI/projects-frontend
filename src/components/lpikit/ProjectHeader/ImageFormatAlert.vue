<template>
    <div class="image-format-alert">
        <svg
            class="arrow"
            width="95"
            height="60"
            viewBox="0 0 95 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M91.0048 21.9786C78.1297 11.0911 66.0413 2.66201 48.6205 3.67819C37.3956 4.33295 26.0953 10.3005 18.473 18.4214C12.0961 25.2155 12.1631 34.431 11.0967 42.9649C10.6933 46.1924 11.9363 50.2543 11.1389 53.1797C10.922 53.9752 4.91936 49.4488 3.72252 48.6462C3.32882 48.3822 8.01097 52.6063 8.99483 54.1312C14.3542 62.4377 15.4519 44.3592 20.2083 44.108"
                stroke="#6CD5FF"
                stroke-width="6"
                stroke-linecap="round"
            />
        </svg>
        <div class="inner">
            <IconImage class="close" name="Close" @click="$emit('close')" />
            <p>{{ $t('project.image-alert.notice') }}</p>
            <div class="actions">
                <LpiButton
                    :label="$filters.capitalize($t('common.cancel'))"
                    :secondary="true"
                    @click="$emit('close')"
                />

                <LpiButton
                    :label="$filters.capitalize($t('project.image-alert.upload'))"
                    class="footer__right-button"
                    @click="$emit('edit')"
                />
            </div>
        </div>
    </div>
</template>

<script>
import LpiButton from '@/components/lpikit/LpiButton/LpiButton.vue'
import IconImage from '@/components/svgs/IconImage.vue'

export default {
    name: 'ImageFormatAlert',

    emits: ['close', 'edit'],

    components: {
        LpiButton,
        IconImage,
    },
}
</script>
<style lang="scss" scoped>
.image-format-alert {
    position: absolute;
    top: pxToRem(-30px);
    left: pxToRem(82px);

    @media screen and (max-width: $min-tablet) {
        top: pxToRem(20px);
        left: pxToRem(82px);
    }

    z-index: 100;

    .arrow {
        position: absolute;
        top: pxToRem(130px);
        left: pxToRem(-60px);
        z-index: -1;
    }

    .inner {
        position: relative;
        background: $white;
        width: pxToRem(300px);
        height: pxToRem(120px);
        padding: $space-l;
        border: pxToRem(6px) solid $blue;
        border-radius: $border-radius-l;
        display: flex;
        flex-flow: column nowrap;
        justify-content: space-between;

        .close {
            position: absolute;
            top: pxToRem(8px);
            right: pxToRem(8px);
            width: pxToRem(24px);
            height: pxToRem(24px);
            fill: $primary-dark;
            cursor: pointer;
        }

        p {
            line-height: 1.3;
        }

        .actions {
            display: flex;
            justify-content: space-between;
        }
    }
}
</style>
