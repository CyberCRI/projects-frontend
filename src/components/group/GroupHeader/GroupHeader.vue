<template>
    <div class="header-group" v-if="!isLoading">
        <div class="header-group-image">
            <CroppedApiImage
                :alt="`${title} image`"
                :picture-data="image"
                picture-size="medium"
                default-picture="/placeholders/user_placeholder.svg"
            />
        </div>
        <div class="header-group-infos">
            <h1 class="header-group-infos__title">
                {{ title }}
            </h1>
            <p v-if="shortDescription" class="short-description" v-html="shortDescription" />
            <div class="header-group-infos__visibility">
                <p>
                    <span class="icon">
                        <IconImage :name="groupVisibilityIcon" />
                    </span>
                    <span>
                        {{ groupVisibilityLabel }}
                    </span>
                </p>
            </div>
        </div>
        <div class="header-group-options">
            <ToolTip
                class="share-tip shadowed"
                placement="bottom"
                trigger="clickToOpen"
                v-if="email"
            >
                <template #custom-content>
                    <a :href="'mailto:' + email">
                        {{ email }}
                    </a>
                </template>
                <ExternalLabelButton
                    :label="$t('group.contact')"
                    btn-icon="EmailOutline"
                    vertical-layout
                    class="bg-on-hover"
                />
            </ToolTip>
            <ToolTip class="share-tip shadowed" placement="bottom" trigger="clickToOpen">
                <template #custom-content>
                    <div class="share-ctn">
                        <button @click="facebookShare">
                            <IconImage name="Facebook" />
                        </button>
                        <button @click="linkedinShare">
                            <IconImage name="Linkedin" />
                        </button>
                    </div>
                </template>
                <ExternalLabelButton
                    :label="$t('group.share')"
                    btn-icon="Share"
                    vertical-layout
                    class="bg-on-hover"
                />
            </ToolTip>
        </div>
    </div>
    <GroupHeaderSkeleton v-else />
</template>

<script>
import IconImage from '@/components/base/media/IconImage.vue'
import ToolTip from '@/components/base/ToolTip.vue'
import ExternalLabelButton from '@/components/base/button/ExternalLabelButton.vue'
import GroupHeaderSkeleton from '@/components/group/GroupHeader/GroupHeaderSkeleton.vue'
import CroppedApiImage from '@/components/base/media/CroppedApiImage.vue'

export default {
    name: 'GroupHeader',
    components: {
        IconImage,
        ToolTip,
        ExternalLabelButton,
        GroupHeaderSkeleton,
        CroppedApiImage,
    },
    props: {
        title: {
            type: String,
            required: true,
        },
        image: {
            type: [Object, null],
            required: true,
        },
        visibility: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        isLoading: {
            type: Boolean,
            default: false,
            required: false,
        },
        shortDescription: {
            type: String,
            default: null,
            required: false,
        },
    },
    data() {
        return {
            sharedUrl: window.location.origin,
        }
    },
    computed: {
        groupVisibilityLabel() {
            if (this.visibility === 'public') return this.$t('group.visibility-public')
            else if (this.visibility === 'private') return this.$t('group.visibility-private')
            return this.$t('group.visibility-org')
        },

        groupVisibilityIcon() {
            return this.visibility === 'public' ? 'Eye' : 'EyeSlash'
        },
    },
    methods: {
        facebookShare() {
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${this.sharedUrl}`)
        },

        linkedinShare() {
            window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${this.sharedUrl}`)
        },
    },
}
</script>

<style lang="scss" scoped>
.header-group {
    background: $primary-lighter;
    padding: calc($space-2xs * 5) calc($space-s * 5);
    display: flex;
    align-items: center;
    justify-content: flex-start;
    border-radius: $border-radius-l;
    gap: calc($space-s * 5);
    margin-bottom: pxToRem(30px);

    &-image {
        position: relative;
        width: 100px;
        height: 100px;
        border-radius: 50%;
        border: 5px solid $white;
        overflow: hidden;
        flex-shrink: 0;

        .cropped-image {
            width: 100%;
            height: 100%;
        }
    }

    &-infos {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: calc($space-2xs * 5);

        &__title {
            font-weight: 700;
            font-size: clamp(2rem, 3vw, 3rem);
            line-height: $line-height-tight;
            color: $black;
        }

        &__visibility {
            p {
                font-weight: 700;
                font-size: $font-size-xs;
                color: $primary-dark;
                display: flex;
                align-items: center;
                gap: $space-s;

                .icon svg {
                    fill: $primary-dark;
                    width: $layout-size-xl;
                    height: $layout-size-m;
                }
            }
        }
    }

    &-options {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: $space-m;

        .share-ctn button {
            border: none;
            background: white;
        }

        .share-ctn {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: $space-m;
            z-index: 1;

            svg {
                width: 24px;
                fill: $primary-dark;
                cursor: pointer;
            }
        }
    }
}

.short-description {
    font-weight: 400;
    font-size: $font-size-m;
    margin-bottom: $space-l;
}

@media screen and (max-width: $med-tablet) {
    .header-group {
        flex-direction: column;
        align-items: flex-start;
        gap: calc($space-2xs * 5);
        padding: calc($space-2xs * 5);

        &-image {
            width: 200px;
            height: 200px;
            align-self: center;
        }
    }
}
</style>
