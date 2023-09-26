<template>
    <div :class="{ 'big-card': bigCard }" class="team-card">
        <CroppedImage
            :alt="`${user.given_name} ${user.family_name} image`"
            :image-sizes="imageSizes"
            :src="imageError ? defaultImage : userImage"
            @error="placeHolderImg"
            class="img-container"
        />

        <div class="info-container">
            <div class="user-info">{{ userName }}</div>

            <span v-if="bigCard" class="s-title">{{ user.title }}</span>

            <button v-if="bigCard" class="btn" @click="goToFullProfile">
                {{ $t('team.see') }}
            </button>
        </div>

        <div
            v-if="role || canBeRemoved || canBeEdited"
            class="overflowing-elements"
            :class="{ 'no-role': !role }"
        >
            <div v-if="role" class="role">{{ roleFormatted }}</div>

            <LpiButton
                v-if="canBeRemoved"
                left-icon="Close"
                class="remove-btn"
                size="extra-small"
                @click="$emit('remove-user')"
            />

            <LpiButton
                v-if="canBeEdited"
                left-icon="Pen"
                class="edit-btn"
                size="extra-small"
                @click="$emit('edit-user')"
            />
        </div>
    </div>
</template>

<script>
import LpiButton from '@/components/lpikit/LpiButton/LpiButton.vue'
import imageMixin from '@/mixins/imageMixin.ts'
import { pictureApiToImageSizes } from '@/functs/imageSizesUtils.ts'
import CroppedImage from '@/components/lpikit/CroppedImage/CroppedImage.vue'

export default {
    name: 'TeamCard',

    emits: ['remove-user', 'edit-user', 'full-profile'],

    mixins: [imageMixin],

    components: { LpiButton, CroppedImage },

    props: {
        user: {
            type: Object,
            required: true,
        },

        bigCard: {
            type: Boolean,
            default: false,
        },

        canBeRemoved: {
            type: Boolean,
            default: false,
        },

        canBeEdited: {
            type: Boolean,
            default: false,
        },

        role: {
            type: String,
            default: null,
        },
    },

    data() {
        return {
            imageError: false,
        }
    },

    methods: {
        goToFullProfile() {
            this.$emit('full-profile')
        },
        placeHolderImg() {
            this.imageError = true
        },
    },

    computed: {
        isCurrentUser() {
            if (this.user || this.$store.getters['users/user']) return false
            return this.user.id === this.$store.getters['users/user'].id
        },

        roleFormatted() {
            if (this.role) {
                if (this.role === 'owners') return this.$t('role.editor')
                else if (this.role === 'members') return this.$t('role.teammate')
                else if (this.role === 'reviewers') return this.$t('role.reviewer')
            }
            return null
        },

        userName() {
            return this.isCurrentUser
                ? this.$t('team.myself')
                : `${this.user.given_name || this.user.name.firstname} ${
                      this.user.family_name || this.user.name.lastname
                  }`
        },

        userImage() {
            return this.user.profile_picture ? this.user.profile_picture.variations.medium : null
        },
        imageSizes() {
            return this.imageError ? null : pictureApiToImageSizes(this.user.profile_picture)
        },
        defaultImage() {
            return `${this.PUBLIC_BINARIES_PREFIX}/placeholders/user_placeholder.svg`
        },
    },
}
</script>

<style lang="scss" scoped>
.team-card {
    display: inline-flex;
    flex-direction: column;
    border: $border-width-s solid $green;
    border-radius: $border-radius-m;
    background-color: $white;
    transition: background-color 0.3s ease-in;
    position: relative;
    height: 130px;
    width: 118px;

    &.big-card {
        display: inline-flex;
        flex-direction: row;
        width: 226px;
    }

    .overflowing-elements {
        display: flex;
        align-items: center;
        position: absolute;
        top: -10px;
        left: 50%;
        transform: translateX(-50%);

        .role {
            background: $white;
            color: $primary-dark;
            border: $border-width-s solid $green;
            text-transform: uppercase;
            font-size: $font-size-2xs;
            font-weight: 700;
            height: 19px;
            box-sizing: border-box;
            padding: $space-2xs $space-xs;
            border-radius: $border-radius-m;
        }

        .remove-btn {
            margin-left: $space-2xs;
        }

        .edit-btn {
            margin-left: $space-2xs;
        }

        &.no-role {
            left: unset;
            right: $space-2xs;

            .remove-btn {
                margin-left: 0;
            }
        }
    }
}

.team-card:hover {
    background-color: $green-lighter;
}

.img-container {
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    border-bottom: $border-width-s solid $green;
    background-size: cover;
    background-position: top center;
    flex-grow: 1;

    .big-card & {
        flex: 0 0 130px;
        overflow: hidden;
        border-bottom-left-radius: 8px;
        border-top-right-radius: unset;
        border-bottom: unset;
        border-right: $border-width-s solid $green;
    }
}

.image {
    object-fit: cover;
}

.info-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: $space-m;
    justify-content: space-between;

    .big-card & {
        align-items: flex-start;
    }
}

.user-info {
    display: flex;
    flex-direction: column;
    font-size: $font-size-m;
    font-weight: 700;
    color: $black;
    text-align: center;

    .big-card & {
        text-align: start;
    }
}

.team-card.big-card .user-info {
    text-align: left;
}

.s-title {
    font-weight: 400;
    font-size: $font-size-s;
    color: $primary-dark;
}

.btn {
    background-color: transparent;
    border: unset;
    padding: 0;
    text-transform: uppercase;
    cursor: pointer;
    font-weight: 700;
    font-size: $font-size-xs;
    color: $primary-dark;
}
</style>
