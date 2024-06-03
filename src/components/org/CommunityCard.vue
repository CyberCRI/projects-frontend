<template>
    <div v-if="community.is_logo_visible_on_parent_dashboard" class="community-card-ctn">
        <a
            :href="community.website_url"
            :style="backgroundColor"
            class="community-card shadow-box"
            target="_blank"
        >
            <div v-if="community.logo_image" class="community-card__container">
                <img
                    :alt="community.name"
                    :src="community.logo_image.variations.medium"
                    class="community-card__image"
                />
            </div>

            <div v-else class="community-card__container patatoid-ctn">
                <PatatoidIcon
                    :background="patatoidColors.background"
                    :fill="patatoidColors.fill"
                ></PatatoidIcon>

                <h3 :class="{ 'white-name': selected }" class="community-card__name">
                    {{ community.name }}
                </h3>
            </div>
        </a>
    </div>
</template>

<script>
import PatatoidIcon from '@/components/base/media/PatatoidIcon.vue'

export default {
    name: 'CommunityCard',

    components: {
        PatatoidIcon,
    },

    props: {
        community: {
            type: Object,
            required: true,
        },
    },

    computed: {
        backgroundColor() {
            return this.community.logo_image
                ? {
                      background: this.community.background_color,
                  }
                : {}
        },

        patatoidColors() {
            if (this.selected) return { fill: '#4b929d', background: '#1d727c' }
            return { fill: '#D6F3FF', background: '#fff' }
        },
    },
}
</script>

<style lang="scss" scoped>
.community-card-ctn {
    display: flex;
    justify-content: stretch;
    position: relative;
    cursor: pointer;
}

.community-card {
    display: flex;
    flex-grow: 1;
    justify-content: center;
    padding: pxToRem(4.8px);
    border: $border-width-s solid $green;
    border-radius: pxToRem(8px);
    position: relative;
    overflow: hidden;

    &__container {
        display: flex;
        justify-content: space-around;
        align-items: center;
    }

    &__image {
        width: auto;
        height: auto;
        max-width: 100%;
        max-height: 100%;
    }

    &__name {
        font-size: $font-size-l;
        text-transform: uppercase;
        color: $primary-dark;
        font-weight: 900;
        position: absolute;
        text-align: center;
        transition: color 0.15s ease;

        &.white-name {
            color: $white;
        }
    }

    .gradient-ctn {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        overflow: hidden;
        border-radius: calc($border-radius-l - 3px);

        .gradient {
            height: 100%;
            width: 100%;
            transition: opacity 0.15s ease-out;
            background: $black;
            opacity: 0.5;
        }

        &:hover {
            .gradient {
                opacity: 0.3;
            }
        }
    }

    &:active {
        background-color: $primary-dark;
    }
}
</style>
