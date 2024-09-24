import users, { UsersState } from '@/store/modules/users'
import { createStore, StoreOptions } from 'vuex'

export interface State {
    users: UsersState
}

export default createStore({
    strict: import.meta.env.NODE_ENV !== 'production', // WTF ???
    modules: {
        users,
    },
} as StoreOptions<State>)
