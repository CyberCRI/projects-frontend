<template>
    <div class="project-team">
        <div v-if="canEditProject" class="add-user">
            <LpiButton
                :label="$filters.capitalize($t('team.add'))"
                class="add-user-btn"
                @click="projectLayoutToggleAddModal('teamMember')"
            />
        </div>

        <SectionHeader
            v-if="owners && owners.length"
            :has-button="false"
            :quantity="owners.length"
            :title="$filters.capitalize($t('role.editors'))"
        />
        <DynamicGrid v-if="owners && owners.length" :min-gap="gridGap" class="user-card-ctn">
            <ProjectTeamEditor
                v-for="owner in owners"
                :key="owner.id"
                :can-be-edited="canEditProject"
                :can-be-removed="canEditProject"
                @remove-user="launchConfirmModal(owner, 'owners')"
                @edit-user="
                    projectLayoutToggleAddModal('teamMember', { user: owner, role: 'owners' })
                "
            >
                <UserCard :user="owner" @click="openProfileDrawer(owner)" />
            </ProjectTeamEditor>
        </DynamicGrid>

        <SectionHeader
            v-if="members && members.length"
            :has-button="false"
            :quantity="members.length"
            :title="$filters.capitalize($t('role.teammates'))"
        />
        <DynamicGrid v-if="members && members.length" :min-gap="gridGap" class="user-card-ctn">
            <ProjectTeamEditor
                v-for="member in members"
                :key="member.id"
                :can-be-edited="canEditProject"
                :can-be-removed="canEditProject"
                @remove-user="launchConfirmModal(member, 'members')"
                @edit-user="
                    projectLayoutToggleAddModal('teamMember', { user: member, role: 'members' })
                "
            >
                <UserCard :user="member" @click="openProfileDrawer(member)" />
            </ProjectTeamEditor>
        </DynamicGrid>

        <SectionHeader
            v-if="reviewers && reviewers.length"
            :has-button="false"
            :quantity="reviewers.length"
            :title="$filters.capitalize($t('role.reviewers'))"
        />
        <DynamicGrid v-if="reviewers && reviewers.length" :min-gap="gridGap" class="user-card-ctn">
            <ProjectTeamEditor
                v-for="reviewer in reviewers"
                :key="reviewer.id"
                :can-be-edited="canEditProject"
                :can-be-removed="canEditProject"
                @remove-user="launchConfirmModal(reviewer, 'reviewers')"
                @edit-user="
                    projectLayoutToggleAddModal('teamMember', { user: reviewer, role: 'reviewers' })
                "
            >
                <UserCard :user="reviewer" @click="openProfileDrawer(reviewer)" />
            </ProjectTeamEditor>
        </DynamicGrid>

        <SectionHeader
            v-if="groups && groups.length"
            :has-button="false"
            :quantity="groups.length"
            :title="$filters.capitalize($t('role.group'))"
        />
        <DynamicGrid v-if="groups && groups.length" :min-gap="gridGap" class="user-card-ctn">
            <ProjectTeamEditor
                v-for="group in groups"
                :key="group.id"
                :can-be-edited="false"
                :can-be-removed="canEditProject"
                @remove-user="launchConfirmModal(group, 'groups')"
                @edit-user="
                    projectLayoutToggleAddModal('teamMember', { user: group, role: 'reviewers' })
                "
            >
                <GroupCard :group="group" />
            </ProjectTeamEditor>
        </DynamicGrid>

        <ConfirmModal
            v-if="confirmModalVisible"
            :content="$t('team.remove-user-confirm')"
            :title="$t('common.delete-user')"
            @cancel="confirmModalVisible = false"
            @confirm="removeUser('user')"
            :confirm-button-label="$t('common.delete-user')"
            :asyncing="asyncingRemoveUser"
        />

        <ConfirmModal
            v-if="confirmGroupModalVisible"
            :content="$t('team.remove-group-confirm')"
            :title="$t('common.delete')"
            @cancel="confirmGroupModalVisible = false"
            @confirm="removeUser('group')"
            :asyncing="asyncingRemoveUser"
        />

        <ConfirmModal
            v-if="showQuitIsImposible"
            :content="$t('common.cant-quit-other')"
            :title="$t('project.quit')"
            :has-second-button="false"
            :cancel-button-label="$t('common.ok')"
            @cancel="toggleShowQuitIsImposibleVisible"
        />

        <BaseDrawer
            :has-footer="false"
            :is-opened="profileDrawer.isOpened"
            :title="$t('profile.drawer_title')"
            @close="closeProfileDrawer"
        >
            <UserProfile
                v-if="profileDrawer.isOpened"
                ref="profile-user"
                :can-edit="false"
                :user-id="profileDrawer.user_id"
            />
        </BaseDrawer>
    </div>
</template>

<script>
import permissions from '@/mixins/permissions.ts'
import ProjectTab from '@/mixins/ProjectTab.ts'

import SectionHeader from '@/components/base/SectionHeader.vue'
import UserCard from '@/components/people/UserCard.vue'
import GroupCard from '@/components/group/GroupCard.vue'
import ConfirmModal from '@/components/base/modal/ConfirmModal.vue'
import BaseDrawer from '@/components/base/BaseDrawer.vue'
import UserProfile from '@/components/people/UserProfile.vue'
import ProjectTeamEditor from '@/components/project/ProjectTeamEditor.vue'
import LpiButton from '@/components/base/button/LpiButton.vue'
import DynamicGrid from '@/components/base/DynamicGrid.vue'

import { deleteProjectMembers } from '@/api/project-members.service'
import analytics from '@/analytics'
export default {
    name: 'ProjectTeamTab',

    components: {
        UserProfile,
        SectionHeader,
        UserCard,
        GroupCard,
        ConfirmModal,
        BaseDrawer,
        ProjectTeamEditor,
        LpiButton,
        DynamicGrid,
    },

    emits: ['reload-team'],

    inject: ['projectLayoutToggleAddModal'],

    mixins: [permissions, ProjectTab],

    props: {
        project: {
            type: Object,
            default: () => ({}),
        },
        team: {
            type: Object,
            default: () => ({ owners: [], members: [], reviewers: [] }),
        },
    },

    data() {
        return {
            userToBeDeleted: null,
            confirmModalVisible: false,
            confirmGroupModalVisible: false,
            profileDrawer: {
                isOpened: false,
                user_id: null,
            },
            isEditMode: false,
            showQuitIsImposible: false,
            asyncingRemoveUser: false,
            gridGap: 20,
        }
    },

    computed: {
        owners() {
            return this.team.owners
        },

        members() {
            return this.team.members
        },

        reviewers() {
            return this.team.reviewers
        },

        groups() {
            return this.team.people_groups
        },
    },

    methods: {
        launchConfirmModal(user, role) {
            this.userToBeDeleted = { ...user }
            if (role === 'groups') {
                this.confirmGroupModalVisible = true
            } else {
                // a project must have at least one owner
                if (role === 'owners' && this.owners.length === 1) {
                    this.showQuitIsImposible = true
                    return
                }

                this.userToBeDeleted.group = role
                this.confirmModalVisible = true
            }
        },

        toggleShowQuitIsImposibleVisible() {
            this.showQuitIsImposible = !this.showQuitIsImposible
        },

        async removeUser(memberType) {
            let projectNoMoreVisible = false
            try {
                this.asyncingRemoveUser = true
                let body = null
                if (memberType === 'user') {
                    body = {
                        users: [this.userToBeDeleted.id],
                    }
                } else {
                    body = {
                        people_groups: [this.userToBeDeleted.id],
                    }
                }

                try {
                    // TODO messages ?
                    await deleteProjectMembers(this.project.id, body)

                    analytics.project.removeTeamMember({
                        project: {
                            id: this.project.id,
                        },
                        members: body,
                    })
                } catch (e) {
                    console.error(e)
                }

                try {
                    this.$emit('reload-team')
                } catch {
                    // if the project is not visible anymore, we get a 404
                    projectNoMoreVisible = true
                }

                if (memberType === 'user') {
                    this.$store.dispatch('notifications/pushToast', {
                        message: this.$t('toasts.team-member-delete.success'),
                        type: 'success',
                    })
                } else {
                    this.$store.dispatch('notifications/pushToast', {
                        message: this.$t('toasts.team-group-delete.success'),
                        type: 'success',
                    })
                }
            } catch (error) {
                console.error(error)
                /**
                 * we might have a race condition where thre was only two members
                 * and they quit at the same time
                 * so check error and display a "nice" message if this is the case
                 */
                if (error.response?.data?.users) {
                    try {
                        this.$emit('reload-team')
                    } finally {
                        this.showQuitIsImposible = true
                    }
                } else {
                    /**
                     * here this is just a "standard" error, so display it
                     */
                    if (memberType === 'user') {
                        this.$store.dispatch('notifications/pushToast', {
                            message: `${this.$t('toasts.team-member-delete.error')} (${error})`,
                            type: 'error',
                        })
                    } else {
                        this.$store.dispatch('notifications/pushToast', {
                            message: `${this.$t('toasts.team-group-delete.error')} (${error})`,
                            type: 'error',
                        })
                    }
                }
            } finally {
                this.asyncingRemoveUser = false
                this.confirmModalVisible = false
                this.confirmGroupModalVisible = false
                // if we got a 404, we redirect to dashboard
                if (projectNoMoreVisible) this.$router.push({ name: 'HomeRoot' })
            }
        },

        async openProfileDrawer(user) {
            this.profileDrawer.user_id = user.id
            this.profileDrawer.isOpened = true
        },

        closeProfileDrawer() {
            this.profileDrawer.isOpened = false
            this.profileDrawer.user_id = null
        },
    },
}
</script>

<style lang="scss" scoped>
.project-team {
    padding: $space-xl 0;

    .user-card-ctn {
        justify-content: space-between;
    }

    .user-card-ctn:not(:last-of-type) {
        margin-bottom: $space-l;
    }
}

.add-user {
    display: flex;
    justify-content: flex-end;
    padding: $space-l 0;
}
</style>
