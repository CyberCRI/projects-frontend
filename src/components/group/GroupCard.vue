<template>
    <BasicCard
        :group="group"
        :to-link="toLink"
        @click="toGroupPage"
        :data-test="`group-card-${group.name}`"
    >
        <template #actions-right>
            <IconImage class="icon" name="EmailOutline" @click="mailTo" />
            <IconImage v-if="showAddButton" class="icon" name="Plus" @click="$emit('add')" />
            <IconImage
                v-if="showCloseButton"
                class="icon"
                name="CloseCircle"
                @click="$emit('unselect', group)"
            />
        </template>

        <CroppedImage
            :alt="`${group.name} image`"
            :image-sizes="imageSizes"
            :src="imageError ? defaultImage : userImage"
            @error="placeHolderImg"
            class="picture picture-group"
        />

        <div class="text text-limit">
            <div v-if="group.members_count" class="group-count">
                <IconImage name="MultiplePerson" class="icon" />
                {{ group.members_count }}
            </div>
            <div class="card-type">{{ group.name }}</div>
            <p v-html="group.short_description" />
        </div>

        <template #footer v-if="hasSubGroupsLink">
            <div class="subgroups-link" @click.prevent="gotoSubgroup(group)">
                {{ $t('group.see-subgroups', group.children.length) }}
                <IconImage class="arrow" name="ArrowRight" />
            </div>
        </template>
    </BasicCard>
</template>

<script>
import BasicCard from '@/components/base/BasicCard.vue'
import IconImage from '@/components/base/media/IconImage.vue'
import imageMixin from '@/mixins/imageMixin.ts'
import { pictureApiToImageSizes } from '@/functs/imageSizesUtils.ts'
import CroppedImage from '@/components/base/media/CroppedImage.vue'

export default {
    name: 'GroupCard',

    emits: ['add', 'unselect', 'click', 'navigated-away'],

    mixins: [imageMixin],

    components: {
        BasicCard,
        IconImage,
        CroppedImage,
    },

    props: {
        group: {
            type: Object,
            required: true,
        },

        hasAddIcon: {
            type: Boolean,
            default: false,
        },

        hasCloseIcon: {
            type: Boolean,
            default: false,
        },
        hasSubGroupsLink: {
            type: Boolean,
            default: false,
        },
    },

    data() {
        return {
            imageError: false,
        }
    },

    computed: {
        userImage() {
            return this.group.header_image ? this.group.header_image.variations.medium : null
        },
        imageSizes() {
            return this.imageError ? null : pictureApiToImageSizes(this.group.header_image)
        },
        defaultImage() {
            return `${this.PUBLIC_BINARIES_PREFIX}/placeholders/user_placeholder.svg`
        },

        showAddButton() {
            return this.hasAddIcon
        },

        showCloseButton() {
            return this.hasCloseIcon
        },

        toLink() {
            // a to-link attribute make the basic card a router-link
            // witch we dont want when just selecting project
            return this.hasAddIcon
                ? null
                : { name: 'Group', params: { groupId: this.group.slug || this.group.id } }
        },
    },

    methods: {
        mailTo() {
            document.location.href = `mailto:${this.group.email}`
        },

        toGroupPage() {
            // this is a quick and dirty fix to make whole card clickable for selection
            this.hasAddIcon ? this.$emit('add') : this.$emit('navigated-away')
        },
        placeHolderImg() {
            this.imageError = true
        },
        gotoSubgroup(group) {
            this.$router.push({ name: 'Groups', params: { groupId: group.id } })
        },
    },
}
</script>

<style lang="scss" scoped>
.group-count {
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: $font-size-xs;
    color: $primary-dark;
    margin-top: $space-s;

    .icon {
        fill: $primary-dark;
        margin-right: $space-s;
        width: 16px;
    }
}

.card-type {
    font-weight: 700;
    font-size: 16px;
    color: $almost-black;
}

.subgroups-link {
    background-color: $primary-dark;
    color: $white;
    font-weight: bold;
    text-align: center;
    justify-self: end;
    padding: $space-xs $space-s;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: $font-size-xs;
    cursor: pointer;
    font-size: $font-size-s;

    .arrow {
        fill: $white;
        height: $font-size-s;
        width: $font-size-s;
    }
}
</style>
