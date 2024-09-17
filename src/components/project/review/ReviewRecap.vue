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
        />
        <ConfirmModal
            v-if="toDelete"
            :title="$t('common.delete')"
            :content="$t('project.review-confirm-delete')"
            @cancel="toDelete = null"
            @confirm="deleteReview"
        />
    </div>
</template>
<script>
import ReviewDrawer from '@/components/project/review/ReviewDrawer.vue'
import SectionHeader from '@/components/base/SectionHeader.vue'
import ConfirmModal from '@/components/base/modal/ConfirmModal.vue'
import ReviewItem from '@/components/project/review/ReviewItem.vue'
import { deleteReview } from '@/api/reviews.service'
export default {
    name: 'ReviewRecap',

    emits: ['reload-reviews'],

    components: {
        ReviewDrawer,
        SectionHeader,
        ConfirmModal,
        ReviewItem,
    },

    props: {
        project: {
            type: Object,
            default: () => {},
        },

        reviews: {
            type: Array,
            default: () => [],
        },
    },
    data() {
        return {
            editReview: null,
            toDelete: null,
        }
    },
    methods: {
        async deleteReview() {
            try {
                await deleteReview({ project_id: this.project.id, id: this.toDelete.id })
                this.$emit('reload-reviews')
                this.$store.dispatch('notifications/pushToast', {
                    message: this.$t('toasts.review-delete.success'),
                    type: 'success',
                })
            } catch (error) {
                this.$store.dispatch('notifications/pushToast', {
                    message: `${this.$t('toasts.review-delete.error')} (${error})`,
                    type: 'error',
                })
                console.error(error)
            } finally {
                this.toDelete = null
            }
        },
    },
}
</script>
