<template>
  <FetchLoader :status="status" only-error skeleton>
    <ReviewItem
      v-for="(review, index) in reviews"
      :key="index"
      :review="review"
      @delete-review="toDelete = $event"
      @edit-review="editReview = $event"
    />
    <EmptyLabel v-if="reviews.length === 0" />
  </FetchLoader>
  <ReviewDrawer
    v-if="!preview"
    :is-opened="editReview"
    :rdata="{ ...editReview }"
    :project="project"
    @close="editReview = null"
    @reload-reviews="$emit('reload-reviews')"
    @reload-project="$emit('reload-project')"
  />
  <ConfirmModal
    v-if="!preview && toDelete"
    :title="$t('common.delete')"
    :content="$t('project.review-confirm-delete')"
    @cancel="toDelete = null"
    @confirm="onDeleteReview"
  />
</template>

<script setup lang="ts">
import { factoryPagination, maxSkeleton } from '@/skeletons/base.skeletons'
import ReviewDrawer from '@/components/project/review/ReviewDrawer.vue'
import { projectReviewsSkeleton } from '@/skeletons/reviews.skeletons'
import ReviewItem from '@/components/project/review/ReviewItem.vue'
import ConfirmModal from '@/components/base/modal/ConfirmModal.vue'
import type { TranslatedProject } from '@/models/project.model'
import { getProjectReviews } from '@/api/v2/reviews.service'
import FetchLoader from '@/components/base/FetchLoader.vue'
import { deleteReview } from '@/api/reviews.service'
import useToasterStore from '@/stores/useToaster'

const props = withDefaults(
  defineProps<{
    project: TranslatedProject
    preview?: boolean
    limit?: number
  }>(),
  {
    preview: false,
    limit: null,
  }
)

const emit = defineEmits<{
  'reload-reviews': []
  'reload-project': []
}>()

const { t } = useNuxtI18n()

const organizationCode = useOrganizationCode()
const projectId = computed(() => props.project.id)
const limitSkeletons = computed(() => maxSkeleton(props.project.modules.reviews, props.limit))

const {
  status,
  data: reviews,
  // refresh,
} = getProjectReviews(organizationCode, projectId, {
  paginationConfig: {
    limit: props.limit,
  },
  default: () => factoryPagination(projectReviewsSkeleton, limitSkeletons.value),
})

const toaster = useToasterStore()
const editReview = ref(null)
const toDelete = ref(null)

const onDeleteReview = async () => {
  try {
    await deleteReview({ project_id: props.project.id, id: toDelete.value.id })
    emit('reload-reviews')
    toaster.pushSuccess(t('toasts.review-delete.success'))
  } catch (error) {
    toaster.pushError(`${t('toasts.review-delete.error')} (${error})`)
    console.error(error)
  } finally {
    toDelete.value = null
  }
}
</script>
