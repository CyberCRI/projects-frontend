<template>
  <div class="review">
    <div class="actions">
      <ContextActionButton
        v-if="canDestroyReview"
        action-icon="Close"
        class="delete-btn"
        data-test="project-window-review-button-delete"
        @click="$emit('delete-review', review)"
      />
      <ContextActionButton
        v-if="canAddReview"
        action-icon="Pen"
        class="edit-btn"
        data-test="button-edit-project-review"
        @click="$emit('edit-review', review)"
      />
    </div>
    <div v-if="review.reviewer" class="reviewed-by">
      <CroppedApiImage
        :alt="`${review.reviewer.given_name} ${review.reviewer.family_name} image`"
        class="image"
        :picture-data="review?.reviewer?.profile_picture"
        picture-size="medium"
        default-picture="/placeholders/user_placeholder.svg"
      />
      <p class="name">{{ review.reviewer.given_name }} {{ review.reviewer.family_name }}</p>

      <div class="date">
        &nbsp;
        <span v-html="$t('project.reviewed-on-the')" />
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
import CroppedApiImage from '@/components/base/media/CroppedApiImage.vue'
import ContextActionButton from '@/components/base/button/ContextActionButton.vue'

export default {
  name: 'ReviewItem',

  components: {
    CroppedApiImage,
    ContextActionButton,
  },

  props: {
    review: {
      type: Object,
      required: true,
    },
  },

  emits: ['delete-review', 'edit-review'],

  setup() {
    const { canDestroyReview, canAddReview } = usePermissions()
    return { canDestroyReview, canAddReview }
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

  a {
    color: $primary-dark;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
