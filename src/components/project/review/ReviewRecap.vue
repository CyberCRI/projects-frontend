<template>
  <div v-if="reviews.length > 0">
    <SectionHeader
      :title="$t('project.reviews', reviews.length)"
      class="section-header"
      :has-button="false"
    />
    <ReviewItem
      v-for="(review, index) in reviews"
      :key="index"
      :review="review"
      @delete-review="toDelete = $event"
      @edit-review="editReview = $event"
    />
    <ReviewDrawer
      :is-opened="editReview"
      :rdata="{ ...editReview }"
      :project="project"
      @close="editReview = null"
      @reload-reviews="$emit('reload-reviews')"
      @reload-project="$emit('reload-project')"
    />
    <ConfirmModal
      v-if="toDelete"
      :title="$t('common.delete')"
      :content="$t('project.review-confirm-delete')"
      @cancel="toDelete = null"
      @confirm="onDeleteReview"
    />
  </div>
</template>

<script setup lang="ts">
import ReviewDrawer from '~/components/project/review/ReviewDrawer.vue'
import SectionHeader from '~/components/base/SectionHeader.vue'
import ConfirmModal from '~/components/base/modal/ConfirmModal.vue'
import ReviewItem from '~/components/project/review/ReviewItem.vue'
import { deleteReview } from '~/api/reviews.service'
import useToasterStore from '~/stores/useToaster'
import { TranslatedProject } from '~/models/project.model'
import { ReviewModel } from '~/models/review.model'

const props = defineProps<{
  project: TranslatedProject
  reviews: ReviewModel[]
}>()

const emit = defineEmits<{
  'reload-reviews': []
  'reload-project': []
}>()

const { t } = useNuxtI18n()

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
