<script setup lang="ts">
import ContextActionMenuInline from '~/components/base/button/ContextActionMenuInline.vue'
import CroppedApiImage from '~/components/base/media/CroppedApiImage.vue'

import { DEFAULT_USER_PATATOID } from '~/composables/usePatatoids'
import type { TranslatedReview } from '~/models/review.model'
import useUsersStore from '~/stores/useUsers'
import { formatDate } from '~/functs/date'

withDefaults(
  defineProps<{
    review: TranslatedReview
    editable?: boolean
  }>(),
  {
    editable: false,
  }
)

defineEmits<{
  edit: []
  delete: []
}>()

const { locale } = useNuxtI18n()
const { canDestroyReview, canAddReview } = usePermissions()
const userStore = useUsersStore()
</script>

<template>
  <div class="review">
    <div class="actions">
      <ContextActionMenuInline
        v-if="editable"
        :can-delete="canDestroyReview && review.reviewer.id === userStore.id"
        :can-edit="canAddReview && review.reviewer.id === userStore.id"
        @delete="$emit('delete')"
        @edit="$emit('edit')"
      />
    </div>
    <div v-if="review.reviewer" class="reviewed-by">
      <CroppedApiImage
        :alt="`${review.reviewer.given_name} ${review.reviewer.family_name} image`"
        class="image"
        :picture-data="review.reviewer.profile_picture"
        picture-size="medium"
        :default-picture="DEFAULT_USER_PATATOID"
      />
      <p class="name">{{ review.reviewer.given_name }} {{ review.reviewer.family_name }}</p>

      <div class="date">
        {{ ` - ${$t('project.reviewed-on-the')} ${formatDate(review.created_at, locale)}` }}
      </div>
    </div>

    <div class="review-content">
      <h3 class="title">
        {{ review.$t.title }}
      </h3>

      <TipTapOutput class="tiptap-output skeletons-text" :content="review.$t.description" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.review {
  background: var(--white);
  border-radius: $border-radius-l;
  padding: $space-l;
  color: var(--black);
  border: $border-width-s solid var(--primary-dark);
  box-sizing: border-box;
  position: relative;

  .actions {
    display: inline-flex;
    position: absolute;
    right: 0.5rem;
    top: 0.5rem;
    flex-shrink: 0;

    .delete-btn + .edit-btn {
      margin-left: $space-m;
    }
  }

  .reviewed-by {
    display: flex;
    align-items: center;
    color: var(--primary-dark);
    margin-bottom: $space-m;
    gap: $space-m;

    .image {
      width: pxToRem(40px);
      height: pxToRem(40px);
      display: inline-block;
      border-radius: 50%;
    }
  }

  .review-content {
    .title {
      color: var(--primary-dark);
      margin-bottom: $space-m;
      font-size: $font-size-l;
    }
  }
}
</style>
