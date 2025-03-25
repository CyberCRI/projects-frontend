<template>
  <div v-if="asyncing" class="loader">
    <LoaderSimple />
  </div>
  <template v-else>
    <WelcomeModal
      v-if="showWelcomeModal"
      @close="skipCompleteProfile"
      @complete-profile="onCompleteProfile"
    />
    <CompleteProfileDrawer
      :is-opened="showCompleteProfileDrawer"
      :initial-step="completeProfileStep"
      @close="skipCompleteProfile"
      @completed="onProfileCompleted"
    />
    <ProfileCompletedModal
      v-if="showProfileCompletedModal"
      @close="skipTour"
      @take-tour="onTakeTour"
    />
    <TakeTourModal v-if="showTakeTourModal" @close="onCloseTour" />
  </template>
</template>
<script>
import WelcomeModal from '@/components/onboarding/WelcomeModal/WelcomeModal.vue'
import CompleteProfileDrawer from '@/components/people/CompleteProfileDrawer/CompleteProfileDrawer.vue'
import ProfileCompletedModal from '@/components/onboarding/WelcomeModal/ProfileCompletedModal.vue'
import TakeTourModal from '@/components/onboarding/WelcomeModal/TakeTourModal.vue'
import LoaderSimple from '@/components/base/loader/LoaderSimple.vue'
import useUsersStore from '@/stores/useUsers.ts'
export default {
  name: 'OnboardingScreens',

  components: {
    WelcomeModal,
    CompleteProfileDrawer,
    TakeTourModal,
    ProfileCompletedModal,
    LoaderSimple,
  },
  setup() {
    const usersStore = useUsersStore()
    const { onboardingTrapAll } = useOnboardingStatus()
    return {
      usersStore,
      onboardingTrapAll,
    }
  },
  data() {
    return {
      showWelcomeModal: false,
      showCompleteProfileDrawer: false,
      showProfileCompledModal: false,
      showProfileCompletedModal: false,
      showTakeTourModal: false,
      completeProfileStep: 0,
      asyncing: false,
    }
  },

  computed: {},

  created() {
    const status = this.usersStore.userFromApi?.onboarding_status

    this.showWelcomeModal = !!status?.show_welcome

    this.showCompleteProfileDrawer = !!status?.show_complete_profile_modal

    this.completeProfileStep = this.showCompleteProfileDrawer
      ? status?.show_complete_profile_modal - 1
      : 0

    this.showProfileCompletedModal = !!status?.show_profile_completed_modal

    this.showTakeTourModal = !!status?.show_take_tour_modal
  },

  methods: {
    async skipCompleteProfile() {
      this.asyncing = true
      await this.onboardingTrapAll({
        show_complete_profile_modal: false,
        show_take_tour_modal: true,
      })
      this.showWelcomeModal = false
      this.showCompleteProfileDrawer = false // can also be called during complete profile process
      this.showTakeTourModal = true
      this.asyncing = false
    },

    async onCompleteProfile() {
      this.asyncing = true
      await this.onboardingTrapAll({
        show_complete_profile_modal: 1,
      })
      this.showWelcomeModal = false
      this.showCompleteProfileDrawer = true
      this.asyncing = false
    },

    async onProfileCompleted() {
      this.asyncing = true
      await this.onboardingTrapAll({
        show_complete_profile_modal: false,
        show_profile_completed_modal: true,
      })
      this.showCompleteProfileDrawer = false
      this.showProfileCompletedModal = true
      this.asyncing = false
    },

    async skipTour() {
      this.asyncing = true
      await this.onboardingTrapAll({
        show_profile_completed_modal: false,
        show_take_tour_modal: false,
      })
      this.showProfileCompletedModal = false
      this.asyncing = false
    },

    async onTakeTour() {
      this.asyncing = true
      await this.onboardingTrapAll({
        show_profile_completed_modal: false,
        show_take_tour_modal: true,
      })
      this.showProfileCompletedModal = false
      this.showTakeTourModal = true
      this.asyncing = false
    },

    async onCloseTour() {
      this.asyncing = true
      await this.onboardingTrapAll({
        show_take_tour_modal: false,
      })
      this.showTakeTourModal = false
      this.asyncing = false
    },
  },
}
</script>
<style lang="scss" scoped>
.loader {
  position: fixed;
  inset: 0;
  z-index: 9999;
  width: 100vw;
  height: 100vh;
  background-color: $modal-background;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
