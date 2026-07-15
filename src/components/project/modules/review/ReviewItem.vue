<script setup lang="ts">
import ContextActionMenuInline from '~/components/base/button/ContextActionMenuInline.vue'
import CroppedApiImage from '~/components/base/media/CroppedApiImage.vue'

import type { TranslatedProject, TranslatedReview } from 'shared-projects-frontend/models'
import { usePermissionProject } from '~/composables/usePermissions/useProjectPermissions'
import { DEFAULT_USER_PATATOID } from '~/composables/usePatatoids'
import useUsersStore from '~/stores/useUsers'
import { formatDate } from '~/functs/date'

const props = withDefaults(
  defineProps<{
    project: TranslatedProject
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
const { canDeleteReview, canCreateReview } = usePermissionProject(computed(() => props.project.id))
const userStore = useUsersStore()
</script>

<template>
  <div class="review">
    <div class="actions">
      <ContextActionMenuInline
        v-if="editable"
        :can-delete="canDeleteReview && review.reviewer.id === userStore.id"
        :can-edit="canCreateReview && review.reviewer.id === userStore.id"
        @delete="$emit('delete')"
        @edit="$emit('edit')"
      />
    </div>
    <div v-if="review.reviewer" class="reviewed-by">
      <CroppedApiImage
        :alt="`${review.reviewer.given_name} ${review.reviewer.family_name} image`"
        class="image skeletons-background"
        :picture-data="review.reviewer.profile_picture"
        picture-size="medium"
        :default-picture="DEFAULT_USER_PATATOID"
      />
      <p class="name skeletons-text">
        {{ review.reviewer.given_name }} {{ review.reviewer.family_name }}
      </p>

      <div class="date skeletons-text">
        {{ ` - ${$t('project.reviewed-on-the')} ${formatDate(review.created_at, locale)}` }}
      </div>
    </div>

    <div class="review-content">
      <h3 class="title skeletons-text">
        {{ review.$t.title }}
      </h3>

      <TipTapOutput class="tiptap-output skeletons-text" :content="review.$t.description" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '~/design/scss/variables';

.review {
  background: var(--white);
  border-radius: variables.$border-radius-l;
  padding: variables.$space-l;
  color: var(--black);
  border: variables.$border-width-s solid var(--primary-dark);
  box-sizing: border-box;
  position: relative;

  .actions {
    display: inline-flex;
    position: absolute;
    right: 0.5rem;
    top: 0.5rem;
    flex-shrink: 0;

    .delete-btn + .edit-btn {
      margin-left: variables.$space-m;
    }
  }

  .reviewed-by {
    display: flex;
    align-items: center;
    color: var(--primary-dark);
    margin-bottom: variables.$space-m;
    gap: variables.$space-m;

    .image {
      width: variables.pxToRem(40px);
      height: variables.pxToRem(40px);
      display: inline-block;
      border-radius: 50%;
    }
  }

  .review-content {
    .title {
      color: var(--primary-dark);
      margin-bottom: variables.$space-m;
      font-size: variables.$font-size-l;
    }
  }
}
</style>
