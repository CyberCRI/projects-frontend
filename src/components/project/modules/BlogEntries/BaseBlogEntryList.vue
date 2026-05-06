<script setup lang="ts">
import { factoryPagination, maxSkeleton } from '@/skeletons/base.skeletons'
import BaseModuleHeader from '~/components/modules/BaseModuleHeader.vue'
import { blogentriesSkeletons } from '@/skeletons/blogentries.skeletons'
import type { TranslatedBlogEntry } from '~/models/blog-entry.model'
import BlogDrawer from '~/components/project/blog/BlogDrawer.vue'
import type { TranslatedProject } from '@/models/project.model'
import { getBlogEntries } from '@/api/v2/blogentries.service'
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

const toaster = useToaster()
const limitSkeletons = computed(() => maxSkeleton(props.project.modules.blogs, props.limit))

const organizationCode = useOrganizationCode()
const projectId = computed(() => props.project.id)
const {
  status,
  data: blogs,
  pagination,
  key,
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
  selectedBlogEntry.value = null
  closeModals('delete', 'edit')
}

const refreshData = () => {
  refreshNuxtData([
    `${organizationCode}::project::${props.project.id}`,
    `${organizationCode}::project::${props.project.slug}`,
    key.value,
  ])
}

const onDeleteConfirm = () => {
  deleteBlogEntry(props.project.id, selectedBlogEntry.value.id)
    .then(() => {
      toaster.pushSuccess($t('toasts.blog-delete.success'))
      refreshData()
    })
    .catch(() => toaster.pushSuccess($t('toasts.blog-delete.error')))
    .finally(() => cancel())
}

// expnadable
const expanded = ref()
const setExpanded = (state: boolean, blog: TranslatedBlogEntry) => {
  if (state && expanded.value?.id !== blog.id) {
    expanded.value = blog
  } else if (!state && expanded.value?.id == blog.id) {
    expanded.value = null
  }
}
</script>

<template>
  <FetchLoader :status="status" only-error skeleton>
    <BaseModuleHeader :add="editable" :pagination="pagination" @add="openModals('edit')" />
    <div class="list-container">
      <BlogEntry
        v-for="blog in blogs"
        :key="blog.id"
        :blog-entry="blog"
        :can-delete="editable"
        :can-edit="editable"
        :expanded="expanded?.id === blog.id"
        @expanded="setExpanded($event, blog)"
        @edit="onEdit(blog)"
        @delete="onDelete(blog)"
      />
      <EmptyLabel v-if="blogs.length === 0" />
    </div>
    <PaginationButtonsV2 v-if="!preview" :pagination="pagination" />
  </FetchLoader>

  <ConfirmModal
    v-if="stateModals.delete"
    :title="$t('project.blog-entry-confirm-delete')"
    @cancel="cancel"
    @confirm="onDeleteConfirm"
  >
    <BlogEntry :blog-entry="selectedBlogEntry" />
  </ConfirmModal>

  <BlogDrawer
    :is-opened="stateModals.edit"
    :project="project"
    :blog="selectedBlogEntry"
    @close="cancel"
    @reload="refreshData"
  />
</template>
