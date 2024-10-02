<template>
    <div class="review">
        <div class="actions">
            <ContextActionButton
                v-if="canDestroyReview"
                action-icon="Close"
                class="delete-btn"
                @click="$emit('delete-review', review)"
                data-test="project-window-review-button-delete"
            />
            <ContextActionButton
                v-if="canAddReview"
                action-icon="Pen"
                class="edit-btn"
                @click="$emit('edit-review', review)"
                data-test="button-edit-project-review"
            />
        </div>
        <div class="reviewed-by" v-if="review.reviewer">
            <CroppedImage
                :alt="`${review.reviewer.given_name} ${review.reviewer.family_name} image`"
                :image-sizes="imageSizes"
                :src="imageError ? defaultImage : userImage"
                @error="placeHolderImg"
                class="image"
            />
            <p class="name">{{ review.reviewer.given_name }} {{ review.reviewer.family_name }}</p>

            <div class="date">
                &nbsp;<span v-html="$t('project.reviewed-on-the')" />
                {{ $d(new Date(review.created_at)) }}
            </div>
        </div>

        <div class="review-content">
            <div class="title" v-html="review.title" />

            <div class="des" v-html="review.description" />
        </div>
    </div>
</template>
<script>
import imageMixin from '@/mixins/imageMixin.ts'
import permissions from '@/mixins/permissions.ts'
import { pictureApiToImageSizes } from '@/functs/imageSizesUtils.ts'
import CroppedImage from '@/components/base/media/CroppedImage.vue'
import ContextActionButton from '@/components/base/button/ContextActionButton.vue'

export default {
    name: 'ReviewItem',

    emits: ['delete-review', 'edit-review'],

    mixins: [imageMixin, permissions],

    components: {
        CroppedImage,
        ContextActionButton,
    },

    props: {
        review: {
            type: Object,
            required: true,
        },
    },

    data() {
        return {
            imageError: false,
        }
    },

    computed: {
        userImage() {
            return this.review?.reviewer?.profile_picture
                ? this.review?.reviewer?.profile_picture.variations.medium
                : null
        },
        imageSizes() {
            return this.imageError
                ? null
                : pictureApiToImageSizes(this.review?.reviewer?.profile_picture)
        },
        defaultImage() {
            return `${this.PUBLIC_BINARIES_PREFIX}/placeholders/user_placeholder.svg`
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
.review {
    background: $white;
    border-radius: $border-radius-l;
    padding: $space-l;
    color: $black;
    border: $border-width-s solid $primary-dark;
    box-sizing: border-box;
    position: relative;
    margin-bottom: $space-l;

    .actions {
        display: inline-flex;
        position: absolute;
        right: 15px;
        top: 0;
        flex-shrink: 0;
        transform: translateY(-50%);

        .delete-btn + .edit-btn {
            margin-left: $space-m;
        }
    }

    .reviewed-by {
        display: flex;
        align-items: center;
        color: $primary-dark;
        margin-bottom: $space-m;
        gap: $space-m;

        .image {
            width: pxToRem(40px);
            height: pxToRem(40px);
        }
    }

    .review-content {
        .title {
            color: $primary-dark;
            margin-bottom: $space-m;
            font-size: $font-size-l;
        }
    }
}

:deep(.des) {
    strong {
        font-weight: 700;
    }

    em {
        font-style: italic;
    }

    u {
        text-decoration: underline;
    }

    a:hover {
        text-decoration: underline;
    }
}
</style>
