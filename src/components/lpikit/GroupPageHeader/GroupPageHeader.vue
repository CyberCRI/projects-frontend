<template>
    <div class="group-header">
        <div class="group-img-outer-ctn">
            <div class="group-img-ctn">
                <img :src="groupImage" :alt="groupName" />
                <div class="user-quantity">
                    <span>{{ userQuantity }}</span>
                    <PersonIcon />
                </div>
            </div>
        </div>

        <div class="content-ctn">
            <h2 class="group-name">{{ groupName }}</h2>

            <p class="group-description">
                {{ displayedDescription }}
                <LinkButton
                    v-if="longDescription && descriptionIsCropped"
                    :label="$filters.capitalize($t('common.learn-more'))"
                    @click="showCompleteDescription"
                />
            </p>

            <div class="tag-ctn">
                <BadgeItem
                    v-for="tag in displayedTags"
                    :key="tag.name"
                    :label="tag.name"
                    size="small"
                />
                <BadgeItem
                    v-if="numerousTags && !allTagsVisible"
                    :label="additionalTagsLabel"
                    colors="primary-dark"
                    size="small"
                    class="additional-tags"
                    @click="showAllTags"
                />
            </div>

            <div class="location-ctn">
                <div class="img-ctn">
                    <img
                        :src="`${PUBLIC_BINARIES_PREFIX}/map-images/map-preview.png`"
                        alt="map-preview"
                    />
                    <LocationOn />
                </div>

                <span>{{ formattedLocations }}</span>

                <LinkButton
                    v-if="locations.length > 1 && !allLocationsVisible"
                    :label="additionalLocationsLabel"
                    class="more-btn"
                    @click="showAllLocations"
                />
            </div>

            <div class="website-ctn">
                <PublicIcon />
                <LinkButton :label="$t('group.website')" />
            </div>

            <div class="sdg-ctn">
                <!-- TODO: use current user language in store instead of fr -->
                <img
                    v-for="sdg in sdgs"
                    :key="sdg"
                    :alt="sdg"
                    :src="`${PUBLIC_BINARIES_PREFIX}/sdgs/fr/${sdg}.svg`"
                />
            </div>
        </div>

        <div class="actions-ctn">
            <!-- TODO: MaterialBookmark doesn't exist, maybe add it ? -->
            <ExternalLabelButton :label="$t('group.follow')" right-icon="MaterialBookmark" />
            <ExternalLabelButton :label="$t('group.join')" right-icon="PersonAdd" />
            <ExternalLabelButton :label="$t('group.contact')" right-icon="Mail" />
            <ExternalLabelButton :label="$t('group.join-our-chat')" right-icon="ChatBubble" />
            <ExternalLabelButton :label="$t('group.share')" right-icon="Share" />
        </div>
    </div>
</template>

<script>
import PersonIcon from '@/components/svgs/material/PersonIcon.vue'
import LinkButton from '@/components/lpikit/LpiButton/LinkButton.vue'
import BadgeItem from '@/components/lpikit/Badge/BadgeItem.vue'
import LocationOn from '@/components/svgs/material/LocationOn.vue'
import PublicIcon from '@/components/svgs/material/PublicIcon.vue'
import ExternalLabelButton from '@/components/lpikit/LpiButton/ExternalLabelButton.vue'
import imageMixin from '@/mixins/imageMixin.ts'

export default {
    name: 'GroupPageHeader',

    mixins: [imageMixin],

    components: { PersonIcon, LinkButton, BadgeItem, LocationOn, PublicIcon, ExternalLabelButton },

    data() {
        return {
            groupImage: require('./image-test.jpeg'),
            userQuantity: 9999,
            groupName: 'Name of the group',
            groupDescription:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim, nostrud exercitation ut incididunt ut labore et dolore magna aliqua. Ut enim, nostrud exercitation ut',
            descriptionIsCropped: true,
            allTagsVisible: false,
            tags: [
                { name: 'Sciences participatives' },
                { name: 'Deep learning' },
                { name: 'Pédagogie' },
                { name: 'Communauté pédagogique' },
                { name: 'Sciences' },
                { name: 'Programmation' },
                { name: 'Développement durable' },
            ],
            allLocationsVisible: false,
            locations: ['Montpellier, France', 'Rome, Italie', 'Stockholm, Suède'],
            sdgs: [1, 2, 3, 4, 6],
        }
    },

    computed: {
        displayedDescription() {
            return this.longDescription && this.descriptionIsCropped
                ? this.groupDescription.substr(0, 150) + '...'
                : this.groupDescription
        },

        displayedTags() {
            return this.allTagsVisible ? this.tags : this.tags.slice(0, 4)
        },

        formattedLocations() {
            return this.allLocationsVisible ? this.locations.join(' - ') : this.locations[0]
        },

        longDescription() {
            return this.groupDescription.length > 150
        },

        additionalTagsLabel() {
            return `+${this.tags.length - 4} ${this.$t('common.other')}`
        },

        additionalLocationsLabel() {
            return `+${this.locations.length - 1} ${this.$t('common.other')}`
        },

        numerousTags() {
            return this.tags.length > 4
        },
    },

    methods: {
        showAllTags() {
            this.allTagsVisible = true
        },

        showCompleteDescription() {
            this.descriptionIsCropped = false
        },

        showAllLocations() {
            this.allLocationsVisible = true
        },
    },
}
</script>

<style lang="scss" scoped>
.group-header {
    display: flex;
    flex-direction: column;
    gap: $space-xl;

    .group-img-outer-ctn {
        display: flex;
        justify-content: center;

        .group-img-ctn {
            position: relative;

            img {
                border-radius: 50%;
                max-width: 200px;
                min-width: 200px;
                height: 200px;
                object-fit: cover;
                margin: 0 auto;
            }

            .user-quantity {
                background: $primary-dark;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: $white;
                position: absolute;
                left: 0;
                bottom: -60px;
                transform: translateY(-50%);
                width: 80px;
                height: 80px;

                span {
                    font-size: $font-size-l;
                    font-weight: 400;
                }

                svg {
                    fill: $white;
                    height: 18px;
                    width: 18px;
                }
            }
        }
    }

    .content-ctn {
        .group-name {
            font-size: $font-size-4xl;
            font-weight: 700;
            margin: $space-s 0 0 0;
        }

        .group-description {
            font-size: $font-size-m;
            font-weight: 400;
            line-height: $font-size-2xl;
            margin: $space-l 0;
        }

        .tag-ctn {
            display: flex;
            flex-wrap: wrap;
            gap: $space-s;
            margin-bottom: $space-l;

            .additional-tags {
                cursor: pointer;
            }
        }
    }

    .location-ctn {
        border: $border-width-s solid $primary;
        border-radius: $border-radius-xs;
        overflow: hidden;
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: fit-content;
        padding-right: $space-xs;
        height: 32px;
        box-sizing: border-box;
        margin-bottom: $space-m;

        .img-ctn {
            position: relative;
            align-self: stretch;

            img {
                max-width: 100%;
                height: 24px;
            }

            svg {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                fill: $primary;
                width: 16px;
            }
        }

        span {
            color: $primary-dark;
            text-transform: uppercase;
            font-weight: 700;
            font-size: $font-size-2xs;
        }

        .more-btn {
            font-size: $font-size-2xs;
        }
    }

    .website-ctn {
        border: $border-width-s solid $primary;
        border-radius: $border-radius-xs;
        height: 32px;
        box-sizing: border-box;
        padding: $space-xs;
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: fit-content;
        margin-bottom: $space-m;

        button {
            text-transform: uppercase;
            font-size: $font-size-2xs;
            font-weight: 700;
        }

        svg {
            fill: $primary;
            width: 20px;
        }
    }

    .sdg-ctn {
        display: flex;
        flex-wrap: wrap;
        gap: $space-m;
        margin-bottom: $space-l;

        img {
            width: 50px;
            border-radius: $border-radius-xs;
        }
    }

    .actions-ctn {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;

        > * {
            width: 20%;
        }
    }
}

@media screen and (min-width: $min-tablet) {
    .group-header {
        border: $border-width-s solid $primary;
        border-radius: $border-radius-l;
        padding: $space-xl;
        box-sizing: border-box;
        flex-direction: row;
        justify-content: space-between;

        .group-img-outer-ctn {
            width: 250px;
            align-self: flex-start;
        }

        .content-ctn {
            .group-name {
                margin: 0;
            }
        }

        .actions-ctn {
            flex-direction: column;
            align-items: flex-end;

            > * {
                width: unset;
            }
        }
    }
}
</style>
