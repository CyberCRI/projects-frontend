<template>
    <AdminBlock :block-title="blockTitle" :is-loading="isLoading">
        <template #actions>
            <LinkButton
                v-if="featuredProjects.length"
                btn-icon="Pen"
                :label="$t('common.edit')"
                @click="editFeaturedProjects = true"
            />
            <LinkButton
                v-else
                btn-icon="Plus"
                :label="$t('common.add')"
                @click="editFeaturedProjects = true"
            />
        </template>
        <template #default>
            <FeaturedProjectAdminListItem
                v-for="featuredProject in featuredProjects"
                :key="featuredProject.id"
                :project="featuredProject"
            ></FeaturedProjectAdminListItem>
        </template>
    </AdminBlock>
    <PickProjectsDrawer
        :is-opened="editFeaturedProjects"
        @close="editFeaturedProjects = false"
        :pre-selected-projects="featuredProjects"
        @picked-projects="onPickProjects"
        :max-pick="maxProjects"
        :drawer-title="$t('featured-projects.drawer.title')"
    />
</template>
<script>
import AdminBlock from '../AdminBlock.vue'
import LinkButton from '@/components/base/button/LinkButton.vue'
import PickProjectsDrawer from '@/components/project/PickProjectsDrawer/PickProjectsDrawer.vue'
import FeaturedProjectAdminListItem from './FeaturedProjectAdminListItem.vue'
import {
    getFeaturedProjects,
    addFeaturedProject,
    removeFeaturedProject,
} from '@/api/organizations.service'

export default {
    name: 'FeaturedProjectAdminBlock',

    components: {
        AdminBlock,
        LinkButton,
        PickProjectsDrawer,
        FeaturedProjectAdminListItem,
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
            return this.$store.getters['organizations/current']?.code
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
            try {
                const current = this.featuredProjects.map((p) => p.id)
                const picked = projects.map((p) => p.id)

                const toAdd = picked.filter((p) => !current.includes(p))
                const toRemove = current.filter((p) => !picked.includes(p))

                await addFeaturedProject(this.organizationCode, { featured_projects_ids: toAdd })
                await removeFeaturedProject(this.organizationCode, {
                    featured_projects_ids: toRemove,
                })
                this.$store.dispatch('notifications/pushToast', {
                    message: this.$t('featured-projects.save.success'),
                    type: 'success',
                })

                this.featuredProjects = (await getFeaturedProjects(this.organizationCode)).results
            } catch (err) {
                this.$store.dispatch('notifications/pushToast', {
                    message: `${this.$t('featured-projects.save.error')} (${err})`,
                    type: 'error',
                })
                console.error(err)
            } finally {
                this.isLoading = false
            }
        },
    },
}
</script>
