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
            mode="edit"
            :rdata="{ ...editReview }"
            :project="project"
            @close="editReview = null"
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
export default {
    name: 'ReviewRecap',

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
    },
    data() {
        return {
            editReview: null,
            toDelete: null,
        }
    },
    computed: {
        reviews() {
            return this.project.reviews || []
        },
    },
    methods: {
        async deleteReview() {
            try {
                await this.$store.dispatch('reviews/deleteReview', this.toDelete.id)
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
