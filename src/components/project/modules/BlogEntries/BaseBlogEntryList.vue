<script setup lang="ts">
import { getBlogEntries } from '@/api/v2/blogentries.service'
import FetchLoader from '@/components/base/FetchLoader.vue'
import { TranslatedProject } from '@/models/project.model'
import { factoryPagination, maxSkeleton } from '@/skeletons/base.skeletons'
import { blogentriesSkeletons } from '@/skeletons/blogentries.skeletons'

const props = withDefaults(
  defineProps<{ project: TranslatedProject; preview?: boolean; limit?: number }>(),
  {
    preview: false,
    limit: null,
  }
)

const limitSkeletons = computed(() => maxSkeleton(props.project.modules.blogs, props.limit))

const organizationCode = useOrganizationCode()
const projectId = computed(() => props.project.id)
const {
  status,
  data: blogs,
  pagination,
} = getBlogEntries(organizationCode, projectId, {
  query: {
    ordering: '-created_at',
  },
  paginationConfig: {
    limit: props.limit,
  },
  default: () => factoryPagination(blogentriesSkeletons, limitSkeletons.value),
})
</script>

<template>
  <FetchLoader :status="status" only-error skeleton>
    <div class="list-container">
      <BlogEntry v-for="blog in blogs" :key="blog.id" :blog-entry="blog" />
    </div>
    <PaginationButtonsV2 v-if="!preview" :pagination="pagination" />
  </FetchLoader>
</template>
