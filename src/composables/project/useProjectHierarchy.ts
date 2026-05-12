import type { BreadCrumbItem } from '@/components/base/navigation/BreadCrumbs.vue'
import useOrganizationsStore from '@/stores/useOrganizations'
import type { AnyProject } from '@/models/project.model'

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
