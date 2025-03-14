import { patchUser } from '@/api/people.service'
import useUsersStore from '@/stores/useUsers'

type OnboardingKey =
  | 'show_welcome'
  | 'create_project'
  | 'take_tour'
  | 'explore_projects'
  | 'complete_profile'
  | 'show_progress'
  | 'show_complete_profile_modal'
  | 'show_profile_completed_modal'
  | 'show_take_tour_modal'

export type OnboardingStatusType = {
  [key in OnboardingKey]: boolean | number
}
export default function useOnboardingStatus() {
  const onboardingTrap = async (key: OnboardingKey, val: boolean) => {
    // TODO pinia check this
    const usersStore = useUsersStore()
    const connected = usersStore.isConnected
    if (connected) {
      const user = usersStore.userFromApi
      const status = user?.onboarding_status || {}
      if (status[key] !== val) {
        const payload = { onboarding_status: { ...status, [key]: val } }
        await patchUser(user.id, payload)
        await usersStore.getUser(user.id)
      }
    }
  }

  const onboardingTrapAll = async (newStatus: OnboardingStatusType) => {
    // TODO pinia check this
    const usersStore = useUsersStore()
    const connected = usersStore.isConnected
    if (connected) {
      const user = usersStore.userFromApi
      const status = user?.onboarding_status || {}

      const statusIsDifferent = Object.keys(newStatus).some((key) => status[key] !== newStatus[key])

      if (statusIsDifferent) {
        const payload = { onboarding_status: { ...status, ...newStatus } }
        await patchUser(user.id, payload)
        await usersStore.getUser(user.id)
      }
    }
  }

  return {
    onboardingTrap,
    onboardingTrapAll,
  }
}
