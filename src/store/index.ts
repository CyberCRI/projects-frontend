import organizations, { OrganizationsState } from '@/store/modules/organizations'
import projects, { ProjectState } from '@/store/modules/projects'
import users, { UsersState } from '@/store/modules/users'
import { createStore } from 'vuex'

export interface State {
    projects: ProjectState
    organizations: OrganizationsState
    users: UsersState
}

export default createStore({
    strict: import.meta.env.NODE_ENV !== 'production', // WTF ???
    modules: {
        organizations,
        projects,
        users,
    },
})
