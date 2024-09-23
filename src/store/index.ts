import projects, { ProjectState } from '@/store/modules/projects'
import users, { UsersState } from '@/store/modules/users'
import { createStore, StoreOptions } from 'vuex'

export interface State {
    projects: ProjectState
    users: UsersState
}

export default createStore({
    strict: import.meta.env.NODE_ENV !== 'production', // WTF ???
    modules: {
        projects,
        users,
    },
} as StoreOptions<State>)
