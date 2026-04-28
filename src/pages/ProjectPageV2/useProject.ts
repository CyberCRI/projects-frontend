import type { BreadCrumbItem } from '@/components/base/navigation/BreadCrumbs.vue'
import type { ProjectModel, TranslatedProject } from '@/models/project.model'
import useOrganizationsStore from '@/stores/useOrganizations'
import followUtils from '@/functs/followUtils'
import useUsersStore from '@/stores/useUsers'

type AnyProject = ProjectModel | TranslatedProject

export const useProjectHierarchy = (project: ComputedRef<AnyProject>) => {
  const organizationsStore = useOrganizationsStore()

  const { t } = useNuxtI18n()

  const categoryForCurrentOrganization = computed(() => {
    return project.value?.categories?.find(
      (category) => category.organization === organizationsStore.current.code
    )
  })

  const hierarchy = computed<BreadCrumbItem[]>(() => {
    return [
      {
        name: t('home.home'),
        route: { name: 'HomeRoot' },
      },
      {
        name: t('category.title'),
        route: { name: 'Categories' },
      },
      ...(categoryForCurrentOrganization.value?.hierarchy || []).map((cat) => ({
        name: cat.name,
        route: { name: 'Category', params: { slugOrId: cat.slug || cat.id } },
      })),
      ...(categoryForCurrentOrganization.value
        ? [
            {
              name: categoryForCurrentOrganization.value.name,
              route: {
                name: 'Category',
                params: {
                  slugOrId:
                    categoryForCurrentOrganization.value.slug ||
                    categoryForCurrentOrganization.value.id,
                },
              },
            },
          ]
        : []),
    ]
  })

  return hierarchy
}

export const useProjectFollow = (project: ComputedRef<AnyProject>) => {
  const asyncing = ref(false)
  if (asyncing.value) {
    return
  }

  const usersStore = useUsersStore()

  const followed = ref()

  watch(
    project,
    () => {
      followed.value = project.value?.is_followed
    },
    { immediate: true, deep: true }
  )

  const isFollowing = computed(() => {
    return followed.value?.is_followed || false
  })

  const toggleFollow = () => {
    if (asyncing.value) {
      return
    }

    if (isFollowing.value) {
      return followUtils
        .unfollow({
          follower_id: followed.value.follow_id,
          project_id: project.value.id,
        })
        .then(() => {
          followed.value = null
        })
        .finally(() => nextTick(() => (asyncing.value = false)))
    } else {
      return followUtils
        .follow({
          follower_id: usersStore.user.id,
          project_id: project.value.id,
        })
        .then((follow) => {
          followed.value = {
            is_followed: true,
            follow_id: follow.id,
          }
          return follow
        })
        .finally(() => nextTick(() => (asyncing.value = false)))
    }
  }

  return {
    followed,
    isFollowing,
    toggleFollow,
  }
}
