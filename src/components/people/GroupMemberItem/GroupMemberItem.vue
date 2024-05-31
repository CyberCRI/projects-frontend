<template>
    <div class="user" @click="$emit('user-click', user)">
        <CroppedImage
            :alt="user.id ? `${user.given_name} ${user.family_name} image` : `${user.name} image`"
            :image-sizes="imageSizes"
            :src="imageError ? defaultImage : userImage"
            @error="placeHolderImg"
            class="picture"
        />
        <span class="badge" v-if="user.is_leader" data-test="leader-badge">{{
            $t('userItem.teamLeader')
        }}</span>

        <!--        TODO: ask Api to send information-->
        <div v-if="user.role" class="role">{{ user.role }}</div>

        <div v-if="$filters.isNotGroup(user)" class="name-ctn">
            <h4 class="user-name">{{ userName }}</h4>
        </div>

        <!--        TODO: ask Api to send information-->
        <div v-if="$filters.isNotGroup(user)" class="job">{{ user.job }}</div>

        <div v-if="$filters.isGroup(user)" class="name-ctn">
            <h4 class="user-name">{{ user.name }}</h4>
        </div>
    </div>
</template>

<script>
import imageMixin from '@/mixins/imageMixin.ts'
import { pictureApiToImageSizes } from '@/functs/imageSizesUtils.ts'
import CroppedImage from '@/components/base/media/CroppedImage.vue'

export default {
    name: 'GroupMemberItem',

    emits: ['user-click'],

    mixins: [imageMixin],

    components: {
        CroppedImage,
    },

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

    methods: {
        placeHolderImg() {
            this.imageError = true
        },
    },

    computed: {
        userImage() {
            if (this.user.id) {
                return this.user.profile_picture
                    ? this.user.profile_picture.variations.medium
                    : null
            }
            return this.user.header_image ? this.user.header_image.variations.medium : null
        },
        imageSizes() {
            return this.imageError ? null : pictureApiToImageSizes(this.user.profile_picture)
        },
        defaultImage() {
            return `${this.PUBLIC_BINARIES_PREFIX}/placeholders/user_placeholder.svg`
        },

        userName() {
            return `${this.user.given_name?.toLowerCase()} ${this.user.family_name?.toLowerCase()}`
        },
    },
}
</script>

<style lang="scss" scoped>
.user {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: min-content;

    .picture {
        width: pxToRem(120px);
        height: pxToRem(120px);
        object-fit: cover;
        object-position: top center;
        border-radius: 50%;
    }

    .role {
        background: $primary;
        color: $primary-dark;
        padding: $space-3xs $space-2xs;
        margin-top: $space-xs;
    }

    .badge {
        background: $primary-dark;
        font-weight: 400;
        font-size: $font-size-s;
        margin-top: $space-s;
        padding: $space-2xs;
        color: $white;
    }

    .user-name {
        text-transform: capitalize;
    }

    .name-ctn {
        display: flex;
        align-items: center;
        margin-top: $space-s;
        text-align: center;

        h4 {
            margin: 0;
            font-weight: 700;
            font-size: $font-size-m;
            line-height: $line-height-tight;
        }

        svg {
            height: 16px;
            width: 16px;
            fill: $primary-dark;
            cursor: pointer;
            margin-left: $space-s;
        }
    }

    .job {
        margin-top: $space-s;
        text-align: center;
        font-size: $font-size-s;
    }
}
</style>
