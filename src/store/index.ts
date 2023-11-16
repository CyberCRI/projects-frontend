import attachmentFiles from '@/store/modules/attachment-files'
import attachmentLinks from '@/store/modules/attachment-links'
import blogEntries from '@/store/modules/blog-entries'
import comments, { CommentsState } from '@/store/modules/comments'
import faqs, { FaqsState } from '@/store/modules/faqs'
import follows from '@/store/modules/follows'
import goals from '@/store/modules/goals'
import groups, { GroupsState } from '@/store/modules/groups'
import languages, { LanguageState } from '@/store/modules/languages'
import locations, { LocationsState } from '@/store/modules/locations'
import notifications, { NotificationsState } from '@/store/modules/notifications'
import organizations, { OrganizationsState } from '@/store/modules/organizations'
import people, { PeopleState } from '@/store/modules/people'
import projectCategories, { ProjectCategoriesState } from '@/store/modules/project-categories'
import projectMembers, { ProjectMembersState } from '@/store/modules/project-members'
import projects, { ProjectState } from '@/store/modules/projects'
import announcements, { AnnouncementsState } from '@/store/modules/announcements'
import peopleGroups, { PeopleGroupsState } from '@/store/modules/people-groups'
import reviews from '@/store/modules/reviews'
import sdgs from '@/store/modules/sdgs'
import templates, { TemplatesState } from '@/store/modules/templates'
import users, { UsersState } from '@/store/modules/users'
import { createStore } from 'vuex'

export interface State {
    faqs: FaqsState
    projectCategories: ProjectCategoriesState
    projectMembers: ProjectMembersState
    projects: ProjectState
    organizations: OrganizationsState
    languages: LanguageState
    users: UsersState
    templates: TemplatesState
    comments: CommentsState
    locations: LocationsState
    announcements: AnnouncementsState
    groups: GroupsState
    notifications: NotificationsState
    people: PeopleState
    peopleGroups: PeopleGroupsState
}

export default createStore({
    strict: import.meta.env.NODE_ENV !== 'production',
    modules: {
        attachmentFiles,
        attachmentLinks,
        blogEntries,
        comments,
        faqs,
        follows,
        goals,
        groups,
        languages,
        locations,
        notifications,
        organizations,
        people,
        projectCategories,
        projectMembers,
        projects,
        announcements,
        reviews,
        sdgs,
        templates,
        users,
        peopleGroups,
    },
})
