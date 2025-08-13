<template>
  <AdminBlock :block-title="blockTitle" :is-loading="isLoading">
    <template #default>
      <FeaturedProjectAdminListItem
        v-for="featuredProject in featuredProjects"
        :key="featuredProject.id"
        :project="featuredProject"
      />
    </template>
    <template #footer>
      <LpiButton
        v-if="featuredProjects.length"
        btn-icon="Pen"
        :label="$t('common.edit')"
        @click="editFeaturedProjects = true"
      />
      <LpiButton
        v-else
        btn-icon="Plus"
        :label="$t('common.add')"
        @click="editFeaturedProjects = true"
      />
    </template>
  </AdminBlock>
  <PickProjectsDrawer
    :is-opened="editFeaturedProjects"
    :pre-selected-projects="featuredProjects"
    :max-pick="maxProjects"
    :drawer-title="$t('featured-projects.drawer.title')"
    @close="editFeaturedProjects = false"
    @picked-projects="onPickProjects"
  />
</template>
<script>
import {
  getFeaturedProjects,
  addFeaturedProject,
  removeFeaturedProject,
} from '@/api/organizations.service'
import useToasterStore from '@/stores/useToaster.ts'
import useOrganizationsStore from '@/stores/useOrganizations.ts'

export default {
  name: 'FeaturedProjectAdminBlock',

  setup() {
    const toaster = useToasterStore()
    const organizationsStore = useOrganizationsStore()
    return {
      toaster,
      organizationsStore,
    }
  },

  data() {
    return {
      featuredProjects: [],
      isLoading: true,
      editFeaturedProjects: false,
      maxProjects: 3,
      asyncing: false,
    }
  },

  computed: {
    blockTitle() {
      let extra = this.isLoading
        ? ''
        : ` (${this.featuredProjects.length} ${this.$t('common.of')} ${this.maxProjects})`
      return this.$t('admin.portal.featured-projects') + extra
    },
    organizationCode() {
      return this.organizationsStore.current?.code
    },
  },

  async mounted() {
    await this.loadFeaturedProjects()
  },

  methods: {
    async loadFeaturedProjects() {
      this.isLoading = true
      this.featuredProjects = (await getFeaturedProjects(this.organizationCode)).results
      this.isLoading = false
    },

    async onPickProjects(projects) {
      this.isLoading = true
      this.editFeaturedProjects = false
      try {
        const current = this.featuredProjects.map((p) => p.id)
        const picked = projects.map((p) => p.id)

        const toAdd = picked.filter((p) => !current.includes(p))
        const toRemove = current.filter((p) => !picked.includes(p))

        await addFeaturedProject(this.organizationCode, { featured_projects_ids: toAdd })
        await removeFeaturedProject(this.organizationCode, {
          featured_projects_ids: toRemove,
        })
        this.toaster.pushSuccess(this.$t('featured-projects.save.success'))

        this.featuredProjects = (await getFeaturedProjects(this.organizationCode)).results
      } catch (err) {
        this.toaster.pushError(`${this.$t('featured-projects.save.error')} (${err})`)
        console.error(err)
      } finally {
        this.isLoading = false
      }
    },
  },
}
</script>
