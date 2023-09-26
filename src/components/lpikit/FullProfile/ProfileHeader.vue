<template>
    <div class="profile-header">
        <div class="profile-content">
            <div class="img-block">
                <div class="img-ctn">
                    <CroppedImage
                        :alt="`${user.given_name} ${user.family_name} image`"
                        :src="imageError ? defaultImage : userImage"
                        @error="placeHolderImg"
                        :image-sizes="imageSizes"
                    />
                </div>
            </div>

            <div class="user-info-ctn">
                <div class="main">
                    <div class="name-ctn">
                        <div class="name">
                            {{ user.given_name }} {{ user.family_name }}
                            <span v-if="user.pronouns && user.pronouns.length" class="pronouns">
                                ({{ user.pronouns }})
                            </span>
                        </div>
                    </div>

                    <div class="job">{{ $filters.capitalize(user.job) }}</div>

                    <div v-if="displayableGroups.length" class="group-ctn">
                        <div v-for="group in displayableGroups" :key="group.id">
                            <BadgeItem
                                @click="
                                    $router.push({
                                        name: 'Group',
                                        params: {
                                            groupId: group.id,
                                        },
                                    })
                                "
                                v-if="group && group.name"
                                :label="group.name"
                                class="group"
                                size="small"
                            />
                        </div>
                    </div>

                    <p
                        v-if="user.short_description"
                        class="short-description"
                        v-html="user.short_description"
                    />

                    <div v-if="user && user.sdgs && user.sdgs.length" class="sdg-ctn">
                        <router-link
                            v-for="sdg in user.sdgs"
                            :key="sdg"
                            :to="`/search/people?sdgs=${sdg}&section=people&page=1`"
                        >
                            <img
                                :alt="sdg"
                                :src="`${PUBLIC_BINARIES_PREFIX}/sdgs/logo/SDG-${sdg}.svg`"
                                class="sdg-img"
                            />
                        </router-link>
                    </div>
                </div>
            </div>

            <div
                class="user-contacts-ctn"
                :class="{
                    'mail-only':
                        !user.mobile &&
                        !user.location &&
                        !user.facebook &&
                        !user.twitter &&
                        !user.linkedin &&
                        !user.skype,
                }"
            >
                <div v-if="user && user.email" class="social">
                    <IconImage class="icon" name="Email" />
                    <span>{{ user.email }}</span>
                </div>

                <!-- TODO: Use privacy settings -->
                <div v-if="user.mobile" class="social">
                    <IconImage class="icon" name="Phone" />
                    <span>{{ user.mobile }}</span>
                </div>

                <div v-if="user && user.location" class="social">
                    <IconImage class="icon" name="MapMarker" />
                    <span v-html="fixLocation(user.location)"></span>
                </div>

                <SocialNetworks :user="user" />
            </div>
        </div>
    </div>
</template>

<script>
import IconImage from '@/components/svgs/IconImage.vue'
import BadgeItem from '@/components/lpikit/Badge/BadgeItem.vue'
import SocialNetworks from './SocialNetworks.vue'
import imageMixin from '@/mixins/imageMixin.ts'
import { pictureApiToImageSizes } from '@/functs/imageSizesUtils.ts'
import CroppedImage from '@/components/lpikit/CroppedImage/CroppedImage.vue'

export default {
    name: 'ProfileHeader',

    emits: ['edit-profile'],

    mixins: [imageMixin],

    components: { IconImage, BadgeItem, SocialNetworks, CroppedImage },

    props: {
        user: {
            type: Object,
            default: () => {},
        },
    },
    data() {
        return {
            imageError: false,
        }
    },

    computed: {
        userImage() {
            return this.user.profile_picture ? this.user.profile_picture.variations.medium : null
        },
        imageSizes() {
            return this.imageError ? null : pictureApiToImageSizes(this.user.profile_picture)
        },

        defaultImage() {
            return `${this.PUBLIC_BINARIES_PREFIX}/placeholders/user_placeholder.svg`
        },
        displayableGroups() {
            return this.user?.people_groups
                ? this.user.people_groups.filter(
                      (group) =>
                          group.organization === this.$store.getters['organizations/current']?.code
                  )
                : []
        },
    },
    methods: {
        placeHolderImg() {
            this.imageError = true
        },

        fixLocation(l) {
            return l.split('\n').join('<br />')
        },
    },
}
</script>

<style lang="scss" scoped>
.profile-header {
    box-sizing: border-box;
    position: relative;
    padding: 0 $space-20;

    .img-block {
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-basis: pxToRem(240px);
        width: pxToRem(240px);
        flex-shrink: 0;
        margin: 0 auto $space-xl auto;

        .img-ctn {
            width: pxToRem(240px);
            height: pxToRem(240px);
            border-radius: 100%;
            overflow: hidden;
            flex-shrink: 0;

            .cropped-image {
                width: 100%;
                height: 100%;
            }
        }
    }

    .user-info-ctn {
        display: flex;
        flex-direction: column;
        align-items: flex-start;

        .main {
            flex-grow: 1;
            width: 100%;
            margin-bottom: $font-size-5xl;

            > *:last-child {
                margin-bottom: 0 !important;
            }

            .name-ctn {
                display: flex;
                width: 100%;
                align-items: center;
            }

            .name {
                flex-grow: 1;
                font-size: $font-size-5xl;
                font-weight: 700;
                margin-bottom: $space-l;
                line-height: 50px;
                text-transform: capitalize;
            }

            .pronouns {
                font-size: $font-size-l;
                font-weight: 400;
            }

            .job {
                font-size: $font-size-l;
                font-weight: 400;
                margin-bottom: $space-l;
                line-height: 26px;
            }

            .short-description {
                font-weight: 400;
                font-size: $font-size-m;
                line-height: 24px;
                margin-bottom: $space-l;
            }

            .short-bio {
                font-size: $font-size-m;
                margin-bottom: $space-l;
                display: flex;
            }

            .group-ctn {
                display: flex;
                gap: $space-s;
                flex-wrap: wrap;
                margin-bottom: $space-l;
            }

            .group {
                cursor: pointer;
            }

            .sdg-ctn {
                display: flex;
                flex-wrap: wrap;
                gap: $space-s;
                margin-top: $space-l;

                .sdg-img {
                    width: pxToRem(40px);
                    height: pxToRem(40px);
                    transition: all 0.2s ease-in-out;

                    &:hover {
                        transform: scale(1.2);
                    }
                }
            }
        }
    }

    .user-contacts-ctn {
        flex-shrink: 0;
        display: flex;
        flex-direction: column;
        flex-basis: pxToRem(300px);
        justify-content: center;
        align-items: flex-start;
        padding: $font-size-5xl;
        background-color: $primary-lighter;
        border-radius: $border-radius-l;
        border: $border-width-s solid $green;
        align-self: stretch;

        &.mail-only {
            justify-content: center;
        }

        .social {
            display: flex;
            align-items: flex-start;

            span {
                padding-top: pxToRem(4px);
            }

            & ~ .social {
                margin-top: $space-m;
            }
        }

        .icon {
            width: 22px;
            height: 22px;
            fill: $primary-dark;
            margin-right: $space-xs;
        }

        span {
            font-weight: 700;
            font-size: $font-size-m;
            color: $primary-dark;
        }
    }
}

@media screen and (min-width: $max-tablet) {
    .profile-header {
        border: $border-width-s solid $primary;
        border-radius: $border-radius-l;
        width: 100%;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        padding: 0;

        .profile-content {
            display: flex;
            align-items: center;
            gap: $space-l;
        }

        .img-block {
            padding: $space-xl 0 $space-xl $space-l;
            margin: 0;
        }

        .user-info-ctn {
            flex-grow: 1;
            align-items: flex-end;
            padding: $space-xl 0;

            .main {
                margin-bottom: 0;
            }

            .name {
                margin-bottom: $space-s;
            }

            .short-bio {
                font-size: $font-size-s;
                margin-bottom: $space-m;
            }
        }

        .user-contacts-ctn {
            padding: $space-xl $space-l;
            border-radius: 0 $border-radius-l $border-radius-l 0;
            border: 0 none;

            .mail-ctn {
                display: flex;
                align-items: center;
                margin-bottom: $space-m;

                svg {
                    width: 10px;
                    fill: $primary-dark;
                    margin-right: $space-xs;
                }

                span {
                    text-decoration: underline;
                    font-weight: 700;
                    font-size: $font-size-s;
                    color: $primary-dark;
                }
            }

            .room {
                font-size: $font-size-s;
                margin-bottom: $space-m;
                display: flex;
                color: $primary-dark;
                font-weight: 700;

                .marker-icon {
                    width: 14px;
                    height: 14px;
                    fill: $primary-dark;
                }
            }
        }
    }
}
</style>
