<template>
    <div class="team-card-small" @click="iconName ? $emit('user-clicked') : null">
        <div class="user-container">
            <CroppedImage
                :alt="
                    user.keycloack_id
                        ? `${user.given_name} ${user.family_name} image`
                        : `${user.name} image`
                "
                :image-sizes="imageSizes"
                :src="imageError ? defaultImage : userImage"
                @error="placeHolderImg"
                class="img-container"
            />

            <div class="user-info">
                <div class="name" v-if="user.keycloak_id || user.people_id">
                    {{ $filters.capitalize(user.given_name) }}
                    {{ $filters.capitalize(user.family_name) }}
                </div>
                <div v-else class="name">
                    {{ $filters.capitalize(user.name) }}
                </div>
                <div v-if="roleLabel" class="role">{{ $t(roleLabel) }}</div>

                <div v-if="user.job" class="title">{{ user.job }}</div>
            </div>
        </div>

        <div v-if="iconName" class="icon">
            <IconImage :name="iconName" @click="$emit('user-clicked')" />
        </div>
    </div>
</template>

<script>
import IconImage from '@/components/svgs/IconImage.vue'
import imageMixin from '@/mixins/imageMixin.ts'
import { pictureApiToImageSizes } from '@/functs/imageSizesUtils.ts'
import CroppedImage from '@/components/lpikit/CroppedImage/CroppedImage.vue'

export default {
    name: 'TeamCardInline',

    mixins: [imageMixin],

    components: { IconImage, CroppedImage },

    emits: ['user-clicked'],

    props: {
        user: {
            type: Object,
            required: true,
        },

        roleLabel: {
            type: [String, null],
            default: null,
        },

        icon: {
            type: String,
            default: null,
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

        currentUser() {
            return this.$store.getters['users/userFromApi']
        },

        iconName() {
            if (this.icon) return this.icon
            return this.user.people_id !== this.currentUser.people_id ? 'Close' : null
        },
    },

    methods: {
        placeHolderImg() {
            this.imageError = true
        },
    },
}
</script>

<style lang="scss" scoped>
.team-card-small {
    display: flex;
    align-items: center;
    padding: $space-l $space-m;
    box-sizing: border-box;
    border: $border-width-s solid $green;
    border-radius: $border-radius-m;
    background-color: $white;
    height: pxToRem(118px);
    color: $black;
    position: relative;
    justify-content: space-between;
    cursor: pointer;

    .user-container {
        display: flex;
        align-items: center;
    }

    .img-container {
        border-radius: 50%;
        background-size: cover;
        background-position: top center;
        width: pxToRem(48px);
        height: pxToRem(48px);
        flex-shrink: 0;
    }

    .user-info {
        margin-left: $space-m;
        flex-grow: 1;

        .title {
            font-size: $font-size-xs;
            font-weight: 400;
        }
    }

    .lpi-button {
        flex-shrink: 0;
    }

    .icon {
        fill: $primary-dark;
        border: $border-width-s solid $primary-dark;
        width: pxToRem(16px);
        height: pxToRem(16px);
        position: absolute;
        right: 2px;
        top: 2px;
        border-radius: $border-radius-50;
        cursor: pointer;
    }

    .name {
        font-weight: 700;
        font-size: $font-size-s;
        line-height: 20px;
        margin-bottom: $space-m;
    }

    .role {
        background: $green;
        color: $black;
        font-size: $font-size-s;
        font-weight: 700;
        display: inline-block;
        padding: $space-2xs $space-xs;
        margin-bottom: $space-m;
    }
}
</style>
