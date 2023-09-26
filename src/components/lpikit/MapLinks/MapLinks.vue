<template>
    <div class="map-links">
        <div class="title">{{ $t('search.browse-map') }}</div>

        <div class="map-card first">
            <div class="map-card__image">
                <IconImage name="Map" />
            </div>

            <div class="map-card__content">
                <div class="content__top">
                    <div class="content__title">{{ $t('search.geo-map') }}</div>

                    <div class="content__description">
                        {{ $t('search.geo-map-description') }}
                    </div>
                </div>

                <LpiButton
                    class="content__link"
                    @click="goToMap"
                    :label="$t('search.open-map')"
                    left-icon="ArrowUpRightFromSquare"
                    :secondary="true"
                    :border="false"
                    size="small"
                ></LpiButton>
            </div>
        </div>

        <div class="map-card">
            <div class="map-card__image">
                <span>#</span>
            </div>

            <div class="map-card__content">
                <div class="content__top">
                    <div class="content__title">{{ $t('search.tag-map') }}</div>

                    <div class="content__description">
                        {{ $t('search.tag-map-description') }}
                    </div>
                </div>

                <LpiButton
                    class="content__link"
                    @click="goToTagMap"
                    :label="$t('search.open-map')"
                    left-icon="ArrowUpRightFromSquare"
                    :secondary="true"
                    :border="false"
                    size="small"
                ></LpiButton>
            </div>
        </div>
    </div>
</template>

<script>
import LpiButton from '@/components/lpikit/LpiButton/LpiButton.vue'
import IconImage from '@/components/svgs/IconImage.vue'

export default {
    name: 'MapLinks',

    components: {
        IconImage,
        LpiButton,
    },

    methods: {
        goToMap() {
            return this.$router.push('/map')
        },

        goToTagMap() {
            return this.$router.push('/')
        },
    },
}
</script>

<style lang="scss" scoped>
.title {
    font-size: $font-size-m;
    color: $primary-dark;
    font-weight: 700;
    text-align: center;
    margin-bottom: $font-size-xs;
    margin-left: $font-size-xs;
}

.map-card {
    display: flex;
    height: 116px;
    border-radius: $border-radius-m;
    border: $border-width-l solid $primary-dark;

    &.first {
        margin-bottom: $font-size-2xl;
    }

    &__image {
        min-width: 82px;
        background-color: $primary;
        border-radius: $border-radius-s 0 0 $border-radius-s;
        justify-content: center;
        align-items: center;
        border-right: 2px solid $primary-dark;
        display: none;

        span {
            font-size: $font-size-6xl;
            color: white;
            font-weight: 700;
        }

        svg {
            fill: white;
            width: 50px;
        }
    }

    &__content {
        padding: $space-s $space-m $space-s $space-m;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        text-align: left;
        color: $dark;

        .content__title {
            font-weight: 700;
        }

        .content__link {
            width: fit-content;
            padding-left: 2px;
            text-transform: uppercase;

            svg {
                fill: $primary-dark;
                width: 17px;
                margin-right: $font-size-2xs;
            }
        }
    }
}

@media only screen and (min-width: $max-tablet) {
    .map-card__image {
        display: flex;
    }

    .title {
        text-align: left;
    }
}
</style>
