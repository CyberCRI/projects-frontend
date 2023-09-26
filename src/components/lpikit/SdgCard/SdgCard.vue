<template>
    <div class="sdg-card">
        <picture>
            <source
                type="image/webp"
                :srcset="`${PUBLIC_BINARIES_PREFIX}/sdgs/inline/${sdg}.webp`"
                :alt="$t(`sdg.${sdg}.title`)"
            />
            <div
                class="image"
                :style="`background-image: url('${PUBLIC_BINARIES_PREFIX}/sdgs/inline/${sdg}.png')`"
            />
        </picture>
        <span>{{ $t(`sdg.${sdg}.title`) }}</span>
    </div>
</template>

<script>
import imageMixin from '@/mixins/imageMixin.ts'
export default {
    name: 'SdgCard',

    mixins: [imageMixin],

    props: {
        /* eslint-disable-next-line */
        sdg: {
            type: Number,
            required: true,
        },
    },
}
</script>

<style lang="scss" scoped>
.sdg-card {
    border: $border-width-l solid $primary-dark;
    border-radius: $border-radius-m;
    overflow: hidden;
    width: 110px;
    display: flex;
    flex-direction: column;

    span {
        text-transform: uppercase;
        font-size: $font-size-xs;
        font-weight: 700;
        padding: $space-s;
        border-top: $border-width-m solid $primary-dark;
        background: $white;
        text-align: start;
        word-break: break-word;
    }

    picture {
        .image {
            height: 0;
            padding-bottom: math.div(100% * 40, 76); // svg image are 76x40
            background-repeat: no-repeat;
            background-size: contain;
        }
    }

    &.small {
        width: 80px;

        span {
            font-size: $font-size-2xs;
        }
    }
}
</style>
