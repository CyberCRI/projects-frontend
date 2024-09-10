import attachmentFiles from '@/store/modules/attachment-files'
import attachmentLinks from '@/store/modules/attachment-links'
import blogEntries from '@/store/modules/blog-entries'
import follows from '@/store/modules/follows'
import goals from '@/store/modules/goals'
import groups, { GroupsState } from '@/store/modules/groups'
import languages, { LanguageState } from '@/store/modules/languages'
import notifications, { NotificationsState } from '@/store/modules/notifications'
import organizations, { OrganizationsState } from '@/store/modules/organizations'
import projectCategories, { ProjectCategoriesState } from '@/store/modules/project-categories'
import projectMembers, { ProjectMembersState } from '@/store/modules/project-members'
import projects, { ProjectState } from '@/store/modules/projects'
import announcements, { AnnouncementsState } from '@/store/modules/announcements'
import peopleGroups, { PeopleGroupsState } from '@/store/modules/people-groups'
import reviews from '@/store/modules/reviews'
import users, { UsersState } from '@/store/modules/users'
import { createStore } from 'vuex'

export interface State {
    projectCategories: ProjectCategoriesState
    projectMembers: ProjectMembersState
    projects: ProjectState
    organizations: OrganizationsState
    languages: LanguageState
    users: UsersState
    announcements: AnnouncementsState
    groups: GroupsState
    notifications: NotificationsState
    peopleGroups: PeopleGroupsState
}

export default createStore({
    strict: import.meta.env.NODE_ENV !== 'production', // WTF ???
    modules: {
        attachmentFiles,
        attachmentLinks,
        blogEntries,
        follows,
        goals,
        groups,
        languages,
        notifications,
        organizations,
        projectCategories,
        projectMembers,
        projects,
        announcements,
        reviews,
        users,
        peopleGroups,
    },
})
