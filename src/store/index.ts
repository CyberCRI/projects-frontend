import groups, { GroupsState } from '@/store/modules/groups'
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
    users: UsersState
    groups: GroupsState
    peopleGroups: PeopleGroupsState
}

export default createStore({
    strict: import.meta.env.NODE_ENV !== 'production', // WTF ???
    modules: {
        groups,
        organizations,
        projectCategories,
        projects,
        users,
        peopleGroups,
    },
})
