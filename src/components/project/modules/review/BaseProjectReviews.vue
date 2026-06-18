<script setup lang="ts">
import ReviewDrawer from '~/components/project/modules/review/ReviewDrawer.vue'
import ReviewItem from '~/components/project/modules/review/ReviewItem.vue'
import { factoryPagination, maxSkeleton } from '@/skeletons/base.skeletons'
import { refreshProjectData } from '~/composables/project/refreshProject'
import BaseModuleHeader from '~/components/modules/BaseModuleHeader.vue'
import { projectReviewsSkeleton } from '~/skeletons/reviews.skeletons'
import ConfirmModal from '~/components/base/modal/ConfirmModal.vue'
import type FetchLoader from '@/components/base/FetchLoader.vue'
import type { TranslatedProject } from '@/models/project.model'
import type { TranslatedReview } from '~/models/review.model'
import { getProjectReviews } from '~/api/v2/reviews.service'
import LpiSnackbar from '~/components/base/LpiSnackbar.vue'
import { deleteReview } from '~/api/reviews.service'

const props = withDefaults(
  defineProps<{
    project: TranslatedProject
    preview?: boolean
    limit?: number
    editable?: boolean
  }>(),
  {
    preview: false,
    limit: null,
    editable: false,
  }
)

const toaster = useToaster()

const { t } = useNuxtI18n()
const limitSkeletons = computed(() => maxSkeleton(props.project.modules.reviews, props.limit))

const organizationCode = useOrganizationCode()
const projectId = computed(() => props.project.id)

const { stateModals, closeAllModals, openModals } = useModals({
  edit: false,
  delete: false,
})

const asyncing = ref(false)

const {
  status,
  data: reviews,
  pagination,
  refresh,
} = getProjectReviews(organizationCode, projectId, {
  query: {
    ordering: '-created_at',
  },
  paginationConfig: {
    limit: props.limit,
  },
  default: () => factoryPagination(projectReviewsSkeleton, limitSkeletons.value),
})

const selectedReview = ref<TranslatedReview>()

const cancel = () => {
  closeAllModals()
  selectedReview.value = null
  asyncing.value = false
}

const onReload = () => {
  refreshProjectData(props.project)
  refresh()
}

const onDelete = (review: TranslatedReview) => {
  selectedReview.value = review
  openModals('delete')
}
const onEdit = (review: TranslatedReview) => {
  selectedReview.value = review
  openModals('edit')
}

const onDeleteConfirm = () => {
  asyncing.value = true
  deleteReview(props.project.id, selectedReview.value.id)
    .then(() => {
      toaster.pushSuccess(t(`toast.review-delete.success`))
      onReload()
    })
    .catch(() => toaster.pushError(t(`toast.review-delete.error`)))
    .finally(() => cancel())
}
</script>

<template>
  <FetchLoader :status="status" only-error skeleton>
    <BaseModuleHeader
      v-if="!preview"
      :add-label="$t('project.add-review')"
      :editable="editable && project.life_status === 'toreview'"
      :pagination="pagination"
      @add="openModals('edit')"
    />
    <LpiSnackbar
      v-if="editable && project.life_status !== 'toreview'"
      class="review-warning"
      icon="AlertOutline"
      type="warning"
    >
      {{ $t('project.review-not-editable') }}
    </LpiSnackbar>
    <div class="list-container">
      <ReviewItem
        v-for="review in reviews"
        :key="review.id"
        :review="review"
        :editable="editable"
        @delete="onDelete(review)"
        @edit="onEdit(review)"
      />
    </div>
    <EmptyLabel v-if="reviews.length === 0" />
    <PaginationButtonsV2 v-if="!preview" :pagination="pagination" />
  </FetchLoader>
  <!-- drawer -->
  <ReviewDrawer
    :is-opened="stateModals.edit"
    :project="project"
    :review="selectedReview"
    @reload="onReload"
    @close="cancel"
  />

  <ConfirmModal
    v-if="stateModals.delete"
    :title="$t('project.review-confirm-delete')"
    :asyncing="asyncing"
    @cancel="cancel"
    @confirm="onDeleteConfirm"
  >
    <ReviewItem :review="selectedReview" />
  </ConfirmModal>
</template>

<style lang="scss" scoped>
.review-warning {
  margin: 1rem auto;
}
</style>
