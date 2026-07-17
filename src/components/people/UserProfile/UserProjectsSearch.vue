<template>
  <div :id="projectListId" ref="root">
    <slot
      :is-loading="isLoading"
      :limit="limit"
      :items="items"
      :total-count="totalCount"
      :pagination="pagination"
      :pagination-action="onClickPagination"
    />
  </div>
</template>

<script setup lang="ts">
import { clientAPI, getAllProjects, getUserFollows } from 'shared-projects-frontend/apis'

import type {
  ProjectMemberRoleType,
  QueryFilterProject,
  TranslatedUserModel,
} from 'shared-projects-frontend/models'
import { debounce } from 'es-toolkit'

const props = withDefaults(
  defineProps<{
    // if true, show followed projects
    follow?: boolean
    memberRoles?: ProjectMemberRoleType[]
    user: TranslatedUserModel
    // limit of projects to show
    limit?: number
  }>(),
  {
    follow: false,
    memberRoles: () => [],
    limit: 12,
  }
)

const emit = defineEmits<{
  'number-project': [number]
  'list-updated': [number]
  'pagination-changed': [PaginationResult]
  loading: [boolean]
}>()

const organizationsCode = useOrganizationCode()

const rootRef = useTemplateRef('root')

const projectListId = useUniqueId(16)
const items = ref([])
const isLoading = ref(true)
const totalCount = ref(0)
const pagination = ref({
  currentPage: 1,
  total: 1,
  previous: undefined,
  next: undefined,
  first: undefined,
  last: undefined,
})

const search = computed(() => {
  return {
    limit: props.limit,
    ordering: '-updated_at',
    // @ts-expect-error change string to list
    member_role: props.memberRoles.join(','),
    members: [props.user.id],
    organizations: [organizationsCode],
  } satisfies QueryFilterProject
})

const initProjectLoading = () => {
  items.value = []
  isLoading.value = true
  emit('loading', true)
}

const loadProjects = debounce(async (specificPageIndex = null) => {
  initProjectLoading()
  let response
  if (specificPageIndex) {
    response = await clientAPI(specificPageIndex)
  } else if (props.follow) {
    response = await getUserFollows(
      {
        follower_id: props.user.id,
      },
      { limit: props.limit }
    )
  } else {
    // @ts-expect-error change string to list
    response = await getAllProjects({ query: search.value })
  }
  updateProjectList(response)
}, 40)

onUnmounted(() => loadProjects.cancel())

const updateProjectList = (response) => {
  if (!response) return
  updatePagination(response)
  // Set new projects and end loading
  const maxResults = response.max_results || props.limit

  emit('number-project', response.count)

  totalCount.value = response.count
  if (props.follow) {
    const results = response.results?.map((follow) => follow.project) || []
    items.value.push(...results.slice(0, maxResults))
  } else {
    items.value.push(...(response.results?.slice(0, maxResults) || []))
  }
  isLoading.value = false
  emit('loading', false)

  // Make Home.vue show/hide my-projects section depending on new projects length
  emit('list-updated', response.count)
}

const onClickPagination = (requestedPage) => {
  // this.pagination.currentPage = requestedPage
  loadProjects(requestedPage)
  rootRef.value.scrollIntoView({ behavior: 'smooth' })
}

const updatePagination = (response) => {
  if (!response) return
  const maxResults = response.max_results || 12
  pagination.value.currentPage = response.current_page
  pagination.value.total = response.total_page || Math.ceil(response.count / maxResults)
  pagination.value.previous = response.previous
  pagination.value.next = response.next
  pagination.value.first = response.first
  pagination.value.last = response.last

  // @ts-expect-error rework this components
  emit('pagination-changed', pagination.value)
}

watch(search, () => loadProjects(), { immediate: true, deep: true })
</script>
