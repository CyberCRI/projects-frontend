<template>
    <WelcomeModal
        v-if="showWelcomeModal"
        @close="skipCompleteProfile"
        @complete-profile="onCompleteProfile"
    />
    <CompleteProfileDrawer
        :is-opened="showCompleteProfileDrawer"
        @close="skipCompleteProfile"
        @completed="onProfileCompleted"
    />
    <ProfileCompletedModal
        v-if="showProfileCompletedModal"
        @close="skipTour"
        @take-tour="onTakeTour"
    />
    <TakeTourModal v-if="showTakeTourModal" @close="showTakeTourModal = false" />
</template>
<script>
import WelcomeModal from '@/components/lpikit/WelcomeModal/WelcomeModal.vue'
import CompleteProfileDrawer from '@/components/lpikit/CompleteProfileDrawer/CompleteProfileDrawer.vue'
import ProfileCompletedModal from '@/components/lpikit/WelcomeModal/ProfileCompletedModal.vue'
import TakeTourModal from '@/components/lpikit/WelcomeModal/TakeTourModal.vue'
export default {
    name: 'OnboardingScreens',

    components: { WelcomeModal, CompleteProfileDrawer, TakeTourModal, ProfileCompletedModal },

    data() {
        return {
            showWelcomeModal: false,
            showCompleteProfileDrawer: false,
            showProfileCompledModal: false,
            showProfileCompletedModal: false,
            showTakeTourModal: false,
        }
    },

    created() {
        this.showWelcomeModal =
            !!this.$store.getters['users/userFromApi']?.onboarding_status?.show_welcome
    },

    computed: {},

    methods: {
        skipCompleteProfile() {
            this.showWelcomeModal = false
            this.showCompleteProfileDrawer = false // can also be called during complete profile process
            this.showTakeTourModal = true
        },

        onCompleteProfile() {
            this.showWelcomeModal = false
            this.showCompleteProfileDrawer = true
        },

        onProfileCompleted() {
            this.showCompleteProfileDrawer = false
            this.showProfileCompletedModal = true
        },

        skipTour() {
            this.showProfileCompletedModal = false
        },

        onTakeTour() {
            this.showProfileCompletedModal = false
            this.showTakeTourModal = true
        },
    },
}
</script>
