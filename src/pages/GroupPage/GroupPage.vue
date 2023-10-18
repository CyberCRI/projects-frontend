<template>
    <div class="group-layout">
        <div class="page-section-extra-wide">
            <BreadCrumbs
                v-if="groupHierarchy"
                :breadcrumbs="groupHierarchy"
                :group-name="groupName"
                :is-loading="isLoading"
            />

            <SubGroups
                v-if="groupChildren.length > 0"
                :subgroups="groupChildren"
                :is-loading="isLoading"
            />

            <LpiButton
                v-if="!isLoading && canEditGroup"
                class="edit-btn"
                left-icon="Pen"
                :secondary="true"
                :no-border="true"
                :label="editGroupLabel"
                @click="editGroup"
            />

            <GroupHeader
                :title="groupName"
                :image="groupImage"
                :visibility="groupVisibility"
                :email="groupEmail"
                :short-description="groupShortDescription"
                :is-loading="isLoading"
            />
        </div>
        <div class="page-section-extra-wide tabs-wrapper">
            <GroupTabs
                :description="groupDescription"
                :projects-initial-request="projectsInitialRequest"
                :is-projects-loading="isProjectsLoading"
                :members-initial-request="membersInitialRequest"
                :is-members-loading="isMembersLoading"
                :is-loading="isLoading"
                :align-left="true"
                :border="false"
            />
        </div>
    </div>
</template>

<script>
import BreadCrumbs from '@/components/lpikit/BreadCrumbs/BreadCrumbs.vue'
import SubGroups from '@/components/lpikit/SubGroups/SubGroups.vue'
import GroupHeader from '@/components/lpikit/GroupHeader/GroupHeader.vue'
import GroupTabs from './Tabs/GroupTabs.vue'
import { getGroup, getGroupMember, getGroupProject } from '@/api/group.service'
import permissions from '@/mixins/permissions.ts'
import LpiButton from '@/components/lpikit/LpiButton/LpiButton.vue'

export default {
    name: 'GroupPage',
    components: {
        BreadCrumbs,
        SubGroups,
        GroupHeader,
        GroupTabs,
        LpiButton,
    },
    mixins: [permissions],
    props: {
        groupId: {
            type: String,
            required: true,
        },
    },

    data() {
        return {
            groupName: '',
            groupImage: null,
            groupEmail: '',
            groupVisibility: '',
            groupDescription: '',
            groupShortDescription: '',
            membersInitialRequest: {},
            projectsInitialRequest: {},
            isLoading: true,
            isProjectsLoading: true,
            isMembersLoading: true,
            groupHierarchy: [],
            groupChildren: [],
        }
    },

    computed: {
        currentOrganizationCode() {
            return this.$store.state.organizations.current.code
        },
        editGroupLabel() {
            return this.$t('group.edit-group')
        },
    },

    methods: {
        async load() {
            this.isLoading = true
            this.isProjectsLoading = true
            this.isMembersLoading = true

            this.$store.dispatch('peopleGroups/setCurrentId', this.groupId)
            await Promise.all([this.loadGroup(), this.loadGroupMembers(), this.loadGroupProjects()])

            this.isLoading = false
        },

        async loadGroup() {
            try {
                this.isLoading = true
                const groupData = await getGroup(this.currentOrganizationCode, this.groupId)
                this.groupName = groupData.name
                this.groupImage = groupData.header_image
                this.groupEmail = groupData.email
                this.groupVisibility = groupData.publication_status

                this.groupDescription = groupData.description
                this.groupShortDescription = groupData.short_description

                this.groupHierarchy = groupData.hierarchy.map((group) => ({
                    name: group.name,
                    route: { name: 'Group', params: { groupId: group.slug || group.id } },
                }))
                this.groupChildren = groupData.children
            } catch (e) {
                this.$router.replace({
                    name: 'page404',
                    params: { pathMatch: this.$route.path.substring(1).split('/') },
                })
            } finally {
                this.isLoading = false
            }
        },

        async loadGroupMembers() {
            try {
                const groupMemberData = await getGroupMember(
                    this.currentOrganizationCode,
                    this.groupId
                )
                this.membersInitialRequest = groupMemberData
            } catch (err) {
                console.error(err)
            } finally {
                this.isMembersLoading = false
            }
        },

        async loadGroupProjects() {
            try {
                const groupProjectData = await getGroupProject(
                    this.currentOrganizationCode,
                    this.groupId
                )
                this.projectsInitialRequest = groupProjectData
            } catch (err) {
                console.error(err)
            } finally {
                this.isProjectsLoading = false
            }
        },
        editGroup() {
            this.$router.push({ name: 'frontEditGroup', params: { groupId: this.groupId } })
        },
    },
    watch: {
        groupId: {
            handler: function (neo, old) {
                if (neo && neo != old) this.load()
            },
            immediate: true,
        },
    },
}
</script>

<style lang="scss" scoped>
.group-layout {
    margin-top: pxToRem(48px);
}

.loader {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: $space-2xl 0;
}

.edit-btn {
    display: inline-flex;
    width: 100%;
    justify-content: flex-end;
    padding-bottom: 24px;
}

.recommandations {
    margin-top: $space-2xl;
}
</style>
