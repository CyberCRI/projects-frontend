import type { TranslatedUserModel, UserSlugOrId } from 'shared-projects-frontend/models'
import type { Right } from 'shared-projects-frontend/interfaces'
import { userRights } from 'shared-projects-frontend/lib'
import { useKeycloak } from '@dsb-norge/vue-keycloak-js'
import { getUser } from 'shared-projects-frontend/apis'
import { defineStore } from 'pinia'

const useUserStore = defineStore('user', () => {
  const { authenticated } = useKeycloak()

  const { translateUser } = useAutoTranslate()
  const user = ref<TranslatedUserModel | null>(null)

  // generate right for user
  const rights = computed<Right>(() =>
    userRights({
      permissions: user.value?.permissions || [],
      roles: user.value?.roles || [],
    })
  )

  // user identifications
  const userId = computed(() => {
    if (user.value) {
      return user.value.slug || user.value.id
    }
    return null
  })

  // refresh local user
  const setUser = (userId: UserSlugOrId) => {
    return getUser(userId)
      .then((data) => {
        user.value = unref(translateUser(data))
        return user
      })
      .catch((error) => {
        console.error(error)
        user.value = null
      })
  }
  const refreshUser = () => setUser(user.value.id)
  const removeUser = () => (user.value = null)

  const isConnected = computed(() => authenticated && user.value)

  return { user, userId, setUser, refreshUser, removeUser, rights, isConnected }
})

export default useUserStore
