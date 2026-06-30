<script setup lang="ts">
import BlogDrawer from '~/components/project/modules/BlogEntries/BlogDrawer.vue'
import { factoryPagination, maxSkeleton } from '@/skeletons/base.skeletons'
import { refreshProjectData } from '~/composables/project/refreshProject'
import BaseModuleHeader from '~/components/modules/BaseModuleHeader.vue'
import { blogentriesSkeletons } from '@/skeletons/blogentries.skeletons'
import type { TranslatedBlogEntry } from '~/models/blog-entry.model'
import type { TranslatedProject } from '@/models/project.model'
import { getBlogEntries } from '@/api/v2/blogentries.service'
import NothingHere from '~/components/base/NothingHere.vue'
import FetchLoader from '@/components/base/FetchLoader.vue'
import { deleteBlogEntry } from '~/api/blogentries.service'

const props = withDefaults(
  defineProps<{
    project: TranslatedProject
    preview?: boolean
    limit?: number
    editable?: boolean
  }>(),
  {
    preview: false,
    limit: null,
    editable: false,
  }
)

const asyncing = ref(false)
const toaster = useToaster()
const limitSkeletons = computed(() => maxSkeleton(props.project.modules.blogs, props.limit))

const organizationCode = useOrganizationCode()
const projectId = computed(() => props.project.id)
const {
  status,
  data: blogs,
  pagination,
  refresh,
} = getBlogEntries(organizationCode, projectId, {
  query: {
    ordering: '-created_at',
  },
  paginationConfig: {
    limit: props.limit,
  },
  default: () => factoryPagination(blogentriesSkeletons, limitSkeletons.value),
})

const selectedBlogEntry = ref()
const { stateModals, openModals, closeModals } = useModals({
  edit: false,
  delete: false,
})

const onEdit = (blogEntry) => {
  selectedBlogEntry.value = blogEntry
  openModals('edit')
}

const onDelete = (blogEntry) => {
  selectedBlogEntry.value = blogEntry
  openModals('delete')
}

const cancel = () => {
  asyncing.value = false
  selectedBlogEntry.value = null
  closeModals('delete', 'edit')
}

const refreshData = () => refreshProjectData(props.project).then(() => refresh())

const onDeleteConfirm = () => {
  asyncing.value = true
  deleteBlogEntry(props.project.id, selectedBlogEntry.value.id)
    .then(() => {
      toaster.pushSuccess($t('toasts.blog-delete.success'))
      refreshData()
    })
    .catch(() => toaster.pushSuccess($t('toasts.blog-delete.error')))
    .finally(() => cancel())
}

// expnadable
// expnadable
const route = useRoute()
const expanded = ref<number>()
const setExpanded = (state: boolean, blog: TranslatedBlogEntry) => {
  if (state && expanded.value !== blog.id) {
    expanded.value = blog.id
  } else if (!state && expanded.value == blog.id) {
    expanded.value = null
  }
}

watchEffect(() => {
  expanded.value = parseInt(route.hash.replaceAll('#blogentry:', ''), 10)
})
</script>

<template>
  <FetchLoader :status="status" only-error skeleton>
    <BaseModuleHeader
      v-if="!preview"
      :editable="editable"
      :pagination="pagination"
      @add="openModals('edit')"
    />
    <div class="list-container">
      <BlogEntry
        v-for="blog in blogs"
        :id="`blogentry:${blog.id}`"
        :key="blog.id"
        :to="
          preview
            ? {
                name: 'projectBlog',
                params: { slugOrId: project.slug || project.id },
                hash: `#blogentry:${blog.id}`,
              }
            : null
        "
        :project="project"
        :blog-entry="blog"
        :can-delete="editable"
        :can-edit="editable"
        :class="{
          'scale-hover': preview,
        }"
        :expanded="expanded === blog.id"
        @expanded="setExpanded($event, blog)"
        @edit="onEdit(blog)"
        @delete="onDelete(blog)"
      />
      <NothingHere v-if="blogs.length === 0" />
    </div>
    <PaginationButtonsV2 v-if="!preview" :pagination="pagination" />
  </FetchLoader>

  <ConfirmModal
    v-if="stateModals.delete"
    :title="$t('project.blog-entry-confirm-delete')"
    :asyncing="asyncing"
    @cancel="cancel"
    @confirm="onDeleteConfirm"
  >
    <BlogEntry :blog-entry="selectedBlogEntry" :project="project" />
  </ConfirmModal>

  <BlogDrawer
    :is-opened="stateModals.edit"
    :project="project"
    :blog="selectedBlogEntry"
    @close="cancel"
    @reload="refreshData"
  />
</template>
