<template>
  <div class="project-blog-entries">
    <PageStickyHead v-if="project" :page-title="project.title">
      <template #default>
        <div v-if="isEditionEnabled" class="add-blog">
          <LpiButton
            :label="$filters.capitalize($t('blog.add-entry'))"
            class="add-blog-btn"
            @click="projectLayoutToggleAddModal('blogEntry')"
          />
        </div>
        <PageIndex v-show="summaryItems.length">
          <template #default="{ closeSummary }">
            <BlogSummaryBlock
              :current="expandedEntry"
              :items="summaryItems"
              @item-clicked="
                (evt) => {
                  updateExpanded(evt)
                  closeSummary()
                }
              "
            />
          </template>
        </PageIndex>
      </template>
    </PageStickyHead>
    <div class="blog-entries-ctn">
      <BlogEntry
        v-for="(blogEntry, i) in blogEntries"
        :id="`entry-${blogEntry.id}`"
        :key="blogEntry.id"
        :blog-entry="blogEntry"
        :can-delete="isEditionEnabled"
        :can-edit="isEditionEnabled"
        :is-expanded="expandedEntry === blogEntry.id"
        :is-last-blog-entry="i === 0"
        @toggle-expand="updateExpanded(blogEntry.id)"
        @edit-clicked="projectLayoutToggleAddModal('blogEntry', blogEntry)"
        @delete-clicked="openConfirmModal(blogEntry)"
      />
    </div>

    <ConfirmModal
      v-if="confirmModalVisible"
      :content="$t('project.blog-confirm-delete')"
      :title="$t('common.delete')"
      :asyncing="asyncing"
      @cancel="confirmModalVisible = false"
      @confirm="deleteBlogEntry"
    />
  </div>
</template>

<script>
import BlogEntry from '@/components/project/blog/BlogEntry.vue'
import BlogSummaryBlock from '@/components/project/blog/BlogSummaryBlock.vue'
import ConfirmModal from '@/components/base/modal/ConfirmModal.vue'
import LpiButton from '@/components/base/button/LpiButton.vue'
import analytics from '@/analytics'
import { deleteBlogEntry } from '@/api/blogentries.service'
import useToasterStore from '@/stores/useToaster.ts'
import { useRuntimeConfig } from '#imports'
export default {
  name: 'ProjectBlogEntriesTab',

  components: {
    BlogEntry,
    BlogSummaryBlock,
    ConfirmModal,
    LpiButton,
  },

  inject: ['projectLayoutToggleAddModal'],

  props: {
    project: {
      type: Object,
      default: () => ({}),
    },
    blogEntries: {
      type: Array,
      default: () => [],
    },

    isInEditingMode: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['reload-blog-entries'],
  setup() {
    const toaster = useToasterStore()
    const runtimeConfig = useRuntimeConfig()
    const { canEditProject } = usePermissions()
    useScrollToTab()
    return {
      toaster,
      runtimeConfig,
      canEditProject,
    }
  },

  data() {
    return {
      expandedEntry: null,
      confirmModalVisible: false,
      currentBlogEntry: null,
      sockerserver: this.runtimeConfig.public.appWssHost,
      provider: null,
      asyncing: false,
    }
  },

  computed: {
    isEditionEnabled() {
      return this.canEditProject && this.isInEditingMode
    },
    blogEntriesLength() {
      return this.blogEntries.length
    },

    summaryItems() {
      return this.blogEntries.map((blogEntry) => {
        return {
          id: blogEntry.id,
          label: blogEntry.$t?.title,
          date: blogEntry.created_at,
        }
      })
    },
  },

  watch: {
    blogEntriesLength: {
      handler: function () {
        if (!this.project) return
        // Router needs to be tested, if it's not set right away it might create an error
        if (this.$router && this.blogEntriesLength === 0)
          this.$router.push({
            name: 'projectSummary',
            params: { slugOrId: this.project.slug },
          })
        if (!this.expandedEntry) {
          this.expandedEntry =
            (this.blogEntries.length && this.blogEntries[0] && this.blogEntries[0].id) || null
        }
      },
      immediate: true,
    },
    expandedEntry(neo, old) {
      if (neo && neo != old) {
        this.$nextTick(() => {
          const target = document.getElementById(`entry-${neo}`)

          let offset = 20
          const header = document.querySelector('.header__container')
          if (header) {
            offset += header.getBoundingClientRect().height
          }

          const stickyHead = document.querySelector('.page-sticky-head')
          if (stickyHead) {
            offset += stickyHead.getBoundingClientRect().height
          }

          if (target) {
            const bbox = target.getBoundingClientRect()
            const top = bbox.top
            window.scroll({
              left: 0,
              top: window.scrollY + top - offset,
              behavior: 'smooth',
            })
          }
        })
      }
    },
  },

  methods: {
    updateExpanded(id) {
      const targetEntry = this.blogEntries.find((entry) => entry.id === id)
      if (targetEntry && this.expandedEntry === targetEntry.id) this.expandedEntry = null
      else {
        this.expandedEntry = id
        document.getElementById(`entry-${id}`).scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          offset: 20,
        })
      }
    },

    openConfirmModal(blogEntry) {
      this.confirmModalVisible = true
      this.currentBlogEntry = blogEntry
    },

    async deleteBlogEntry() {
      this.asyncing = true
      try {
        await deleteBlogEntry({
          id: this.currentBlogEntry.id,
          project_id: this.project.id,
        })

        this.$emit('reload-blog-entries')

        analytics.blog.removeBlog({
          project: {
            id: this.project.id,
          },
          blogEntry: this.currentBlogEntry,
        })

        this.toaster.pushSuccess(this.$t('toasts.blog-delete.success'))
      } catch (error) {
        console.error(error)
        this.toaster.pushError(this.$t('toasts.blog-delete.error'))
      } finally {
        this.asyncing = false
        this.confirmModalVisible = false
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.project-blog-entries {
  position: relative;

  .blog-entries-ctn {
    padding-top: 1rem;
    display: flex;
    flex-direction: column;
    gap: $space-l;
  }
}
</style>
