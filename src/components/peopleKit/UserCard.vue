<template>
    <BasicCard
        :button-label="$t('project.card.link')"
        @click="userAction($event)"
        :to-link="!isPrivateUser ? toLink : null"
    >
        <template #actions-right>
            <slot name="actions">
                <IconImage class="icon" name="EmailOutline" @click="mailTo" />
            </slot>
        </template>
        <CroppedImage
            :alt="`${user.given_name} ${user.family_name} image`"
            :image-sizes="imageSizes"
            :src="imageError ? defaultImage : userImage"
            @error="placeHolderImg"
            class="picture picture-user"
        />
        <div class="text text-limit">
            <div class="card-type">{{ userGroups }}</div>
            <div class="card-title">{{ user.given_name }} {{ user.family_name }}</div>
            <div class="card-description">{{ user.job }}</div>
        </div>
    </BasicCard>
</template>
<script>
import BasicCard from '@/components/peopleKit/BasicCard.vue'
import IconImage from '@/components/svgs/IconImage.vue'
import imageMixin from '@/mixins/imageMixin.ts'
import { pictureApiToImageSizes } from '@/functs/imageSizesUtils.ts'
import CroppedImage from '@/components/lpikit/CroppedImage/CroppedImage.vue'

export default {
    name: 'UserCard',

    emits: ['click'],

    mixins: [imageMixin],

    components: {
        BasicCard,
        IconImage,
        CroppedImage,
    },

    props: {
        user: {
            type: Object,
            required: true,
        },
        toLink: {
            type: [String, Object],
            default: null,
        },
    },

    data() {
        return {
            isDetailOpen: false,
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
        isPrivateUser() {
            // Private users do not return an iD from API call
            return !this.user.id
        },
        userGroups() {
            // TODO: use first group name plus groups number (ex: "Staff (+4)")
            // when data will be available in api
            return ''
        },
    },

    methods: {
        mailTo() {
            document.location.href = 'mailto:' + this.user.email
        },
        placeHolderImg() {
            this.imageError = true
        },
        userAction(event) {
            if (this.isPrivateUser) return

            this.$emit('click', event)
        },
    },
}
</script>

<style lang="scss" scoped>
.picture {
    border-radius: 100%;
}
</style>
