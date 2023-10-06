<template>
    <div class="group-snapshot">
        <div v-if="!isLoading" class="description">
            <DescriptionExpandable
                :description="description"
                :height-limit="400"
                class="description-content"
            />
        </div>
        <div v-else class="skeleton">
            <SkeletonComponent width="60%" height="25px" border-radius="10px" />
            <SkeletonComponent width="80%" height="20px" border-radius="10px" />
            <SkeletonComponent width="45%" height="20px" border-radius="10px" />
            <SkeletonComponent width="100%" height="15px" border-radius="10px" />
            <SkeletonComponent width="90%" height="15px" border-radius="10px" />
            <SkeletonComponent width="95%" height="15px" border-radius="10px" />
        </div>

        <div v-if="membersCount > 0 || isMembersLoading" class="members">
            <div class="members-header">
                <h2 class="title">
                    {{ $t('group.members') }}
                    <span v-if="membersCount">( {{ membersCount }} )</span>
                </h2>

                <LpiButton
                    v-if="!isMembersLoading"
                    :label="$filters.capitalize($t('group.see-more'))"
                    class="see-more-button"
                    right-icon="ArrowRight"
                    size="link"
                    @click="toMembers"
                />
            </div>

            <div class="members-container" v-if="isMembersLoading">
                <MemberListSkeleton :desktop-columns-number="6" />
            </div>
            <div class="members-container" v-else>
                <UserItem
                    v-for="member in members.slice(0, totalDisplayed)"
                    :key="member.id"
                    :user="member"
                    :is-manager="member.is_manager"
                    @user-click="openProfileDrawer"
                    class="cursor-pointer shadow-drop"
                    @close="closeProfileDrawer"
                />
            </div>
        </div>

        <div v-if="projectsCount > 0 || isProjectsLoading" class="projects">
            <div class="projects-header">
                <h2 class="title">
                    {{ $t('group.projects') }}
                    <span v-if="projectsCount">( {{ projectsCount }} )</span>
                </h2>
                <LpiButton
                    v-if="!isProjectsLoading"
                    :label="$filters.capitalize($t('group.see-more'))"
                    class="see-more-button"
                    right-icon="ArrowRight"
                    size="link"
                    @click="toProjects"
                />
            </div>
            <div class="projects-container">
                <CardList
                    :desktop-columns-number="6"
                    :is-loading="isProjectsLoading"
                    :limit="4"
                    :projects="projects.slice(0, totalDisplayed)"
                >
                    <template #projects="projectListSlotProps">
                        <ProjectCard
                            :horizontal-display="true"
                            :project="projectListSlotProps.project"
                        />
                    </template>
                </CardList>
            </div>
        </div>
    </div>
    <DrawerLayout
        :has-footer="false"
        :is-opened="profileDrawer.isOpened"
        :title="$t('profile.drawer_title')"
        @close="closeProfileDrawer"
        @confirm="closeProfileDrawer"
    >
        <UserProfile
            v-if="profileDrawer.isOpened"
            ref="profile-user"
            :can-edit="false"
            :kid="profileDrawer.user_kid"
            @close="closeProfileDrawer"
        />
    </DrawerLayout>
</template>

<script>
import LpiButton from '@/components/lpikit/LpiButton/LpiButton.vue'
import DescriptionExpandable from '@/components/lpikit/AnnouncementCard/DescriptionExpandable.vue'
import UserItem from '@/components/lpikit/GroupMemberSection/UserItem.vue'
import CardList from '@/components/lpikit/ProjectList/CardList.vue'
import ProjectCard from '@/components/peopleKit/ProjectCard.vue'
import DrawerLayout from '@/components/lpikit/Drawer/DrawerLayout.vue'
import UserProfile from '@/components/Profile/UserProfile.vue'
import MemberListSkeleton from '@/components/lpikit/Skeleton/MemberListSkeleton.vue'
import SkeletonComponent from '@/components/lpikit/Skeleton/SkeletonComponent.vue'

export default {
    name: 'GroupSnapshotTab',

    components: {
        SkeletonComponent,
        MemberListSkeleton,
        LpiButton,
        DescriptionExpandable,
        UserItem,
        CardList,
        ProjectCard,
        DrawerLayout,
        UserProfile,
    },

    props: {
        description: {
            type: String,
            default: '',
        },

        projectsInitialRequest: {
            type: Object,
            default: () => ({}),
        },

        isProjectsLoading: {
            type: Boolean,
            default: true,
        },

        membersInitialRequest: {
            type: Object,
            default: () => ({}),
        },

        isMembersLoading: {
            type: Boolean,
            default: true,
        },

        isLoading: {
            type: Boolean,
            default: true,
        },
    },

    data() {
        return {
            style: {},
            totalDisplayed: 12,
            profileDrawer: {
                isOpened: false,
                user_kid: null,
            },
        }
    },

    computed: {
        members() {
            return this.membersInitialRequest.results || []
        },
        membersCount() {
            return this.membersInitialRequest.count || 0
        },
        projects() {
            return this.projectsInitialRequest.results || []
        },
        projectsCount() {
            return this.projectsInitialRequest.count || 0
        },
    },

    methods: {
        toMembers() {
            this.$router.push(`/group/${this.$route.params.groupId}/members`)
        },
        toProjects() {
            this.$router.push(`/group/${this.$route.params.groupId}/projects`)
        },
        async openProfileDrawer(user) {
            this.profileDrawer.user_kid = user.keycloak_id
            this.profileDrawer.isOpened = true
        },

        closeProfileDrawer() {
            this.isEditMode = false
            this.profileDrawer.isOpened = false
            this.profileDrawer.user_kid = null
        },
    },
}
</script>

<style lang="scss" scoped>
.description {
    padding: $space-2xl $space-2xl 0 $space-2xl;
}

.members {
    margin-top: $space-xl;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: $space-xl;

    &-header {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        width: 100%;
        gap: $space-l;

        .title {
            font-weight: 700;
            font-size: $font-size-l;
            color: $primary-dark;
        }
    }

    &-container {
        width: 100%;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: $space-m;
        grid-gap: $space-l;

        .cursor-pointer {
            cursor: pointer;
        }
    }
}

.skeleton {
    margin: $space-xl 0;
}

.projects {
    margin-top: $space-2xl;
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    &-header {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        width: 100%;
        gap: $space-l;

        .title {
            font-weight: 700;
            font-size: $font-size-l;
            color: $primary-dark;
        }
    }

    &-container {
        width: 100%;
    }
}

@media screen and (max-width: $med-mobile) {
    .description {
        padding: $space-m $space-m 0 $space-m;
    }
}
</style>