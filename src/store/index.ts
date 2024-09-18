import groups, { GroupsState } from '@/store/modules/groups'
import languages, { LanguageState } from '@/store/modules/languages'
import organizations, { OrganizationsState } from '@/store/modules/organizations'
import projectCategories, { ProjectCategoriesState } from '@/store/modules/project-categories'
import projects, { ProjectState } from '@/store/modules/projects'
import peopleGroups, { PeopleGroupsState } from '@/store/modules/people-groups'
import users, { UsersState } from '@/store/modules/users'
import { createStore } from 'vuex'

export interface State {
    projectCategories: ProjectCategoriesState
    projects: ProjectState
    organizations: OrganizationsState
    languages: LanguageState
    users: UsersState
    groups: GroupsState
    peopleGroups: PeopleGroupsState
}

export default createStore({
    strict: import.meta.env.NODE_ENV !== 'production', // WTF ???
    modules: {
        groups,
        languages,
        organizations,
        projectCategories,
        projects,
        users,
        peopleGroups,
    },
})
