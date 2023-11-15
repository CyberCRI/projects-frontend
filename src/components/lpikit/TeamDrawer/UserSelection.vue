<template>
    <section>
        <div v-if="selectedUsers.length" class="selected-users-grid">
            <UserCardInline
                v-for="(user, index) in filteredUsers"
                :key="user.keycloak_id"
                :user="user"
                :selected="true"
                icon="Close"
                @user-clicked="removeUser(user, index)"
            />
        </div>

        <LpiButton
            v-if="selectedUsers.length > 5"
            class="see-more-btn"
            :label="$filters.capitalize($t(seeMoreLabel))"
            size="link"
            @click="isSeeMore = !isSeeMore"
        />

        <SearchInput
            ref="search-input-ctn"
            v-model="queryString"
            :placeholder="$filters.capitalize($t('search.search'))"
            full
            @enter="searchUser"
            @delete-query="deleteQuery"
        />

        <div v-if="queryString.length >= 3" class="user-ctn">
            <div class="loader-wrapper" v-if="isLoading">
                <LoaderSimple />
            </div>

            <TabsLayout
                :align-left="true"
                :border="false"
                v-else-if="userRequest.count || groupRequest.count"
                class="results-tabs"
                :tabs="tabs"
            />

            <p v-else>{{ $t('team.no-user-message') }}</p>
        </div>
    </section>
</template>

<script>
import debounce from 'lodash.debounce'
import SearchInput from '@/components/lpikit/SearchInput/SearchInput.vue'
import LoaderSimple from '@/components/lpikit/Loader/LoaderSimple.vue'
import LpiButton from '@/components/lpikit/LpiButton/LpiButton.vue'
import { searchGroupsAlgolia } from '@/api/projects.service.ts'
import TabsLayout from '@/components/lpikit/Tabs/TabsLayout.vue'
import TeamResultList from '@/components/lpikit/TeamDrawer/TeamResultList.vue'
import UserCardInline from '@/components/lpikit/TeamCard/UserCardInline.vue'

export default {
    name: 'UserSelection',

    emits: ['select-user'],

    components: {
        LpiButton,
        SearchInput,
        LoaderSimple,
        TabsLayout,
        UserCardInline,
    },

    provide() {
        return {
            userSelectionSelectUser: this.selectUser,
        }
    },

    mounted() {
        this.$refs['search-input-ctn'].$refs['search-input'].focus()
    },

    props: {
        addToCurrentProject: {
            type: Boolean,
            default: true,
        },

        currentUsers: {
            type: Array,
            default: () => [],
        },

        project: {
            type: Object,
            default: () => {},
        },
    },

    data() {
        return {
            isLoading: true,
            queryString: '',
            selectedUsers: [],
            isSeeMore: true,
            userRequest: {},
            groupRequest: {},
            hasToSelectGroups: true,
            hasToSelectPeople: true,
        }
    },

    computed: {
        tabs() {
            return [
                {
                    key: 'member-results',
                    label:
                        this.userRequest.count +
                        ' ' +
                        (this.userRequest.count > 1
                            ? this.$t('result_box.people')
                            : this.$t('result_box.person')),
                    component: TeamResultList,
                    props: {
                        initialRequest: this.userRequest,
                        addToCurrentProject: this.addToCurrentProject,
                        team: this.team,
                        currentUsers: this.currentUsers,
                        selectedUsers: this.selectedUsers,
                        type: 'users',
                    },
                },
                {
                    key: 'group-results',
                    label:
                        this.groupRequest.count +
                        ' ' +
                        (this.groupRequest.count > 1
                            ? this.$t('result_box.groups')
                            : this.$t('result_box.group')),
                    component: TeamResultList,
                    props: {
                        initialRequest: this.groupRequest,
                        addToCurrentProject: this.addToCurrentProject,
                        team: this.team,
                        currentUsers: this.currentUsers,
                        selectedUsers: this.selectedUsers,
                        type: 'groups',
                    },
                },
            ]
        },
        team() {
            const owners = this.project && this.project.team.owners ? this.project.team.owners : []
            const reviewers =
                this.project && this.project.team.reviewers ? this.project.team.reviewers : []
            const members =
                this.project && this.project.team.members ? this.project.team.members : []
            const people_groups =
                this.project && this.project.team.people_groups
                    ? this.project.team.people_groups
                    : []

            return [...owners, ...reviewers, ...members, ...people_groups]
        },

        filteredUsers() {
            return this.isSeeMore ? this.selectedUsers.slice(0, 5) : this.selectedUsers
        },

        seeMoreLabel() {
            return this.isSeeMore ? 'common.see-more' : 'common.see-less'
        },
    },

    methods: {
        searchUser: debounce(async function () {
            this.isLoading = true

            const userFilters = {
                limit: 30,
            }
            this.userRequest = await this.$store.dispatch('people/searchPeopleProject', {
                search: this.queryString,
                org_id: this.$store.getters['organizations/current'].id,
                param: userFilters,
            })

            const groupFilters = {
                limit: 30,
                organizations: this.$store.getters['organizations/current'].code,
            }
            this.groupRequest = await searchGroupsAlgolia(
                encodeURIComponent(this.queryString),
                groupFilters
            )

            this.isLoading = false
        }, 500),

        selectUser(user) {
            this.selectedUsers.push(user)
            if (user.keycloak_id) {
                user.role = 'owners'
            }

            this.$emit('select-user', this.selectedUsers)
        },

        removeUser(user, index) {
            user.selected = false
            this.selectedUsers.splice(index, 1)
            this.$emit('select-user', this.selectedUsers)
        },

        deleteQuery() {
            this.queryString = ''
            this.results = []
        },
    },

    watch: {
        queryString: function (val) {
            if (val.length >= 3) this.searchUser()
            if (this.queryString === '') this.results = []
        },
    },
}
</script>

<style lang="scss" scoped>
section,
.user-ctn {
    flex-grow: 1;
    display: flex;
    flex-flow: column nowrap;
}

.hide-card {
    display: none;
}

.selected-users-grid {
    display: flex;
    flex-wrap: wrap;
    overflow-y: hidden;
    gap: $space-m;
    width: 100%;
    align-content: flex-start;
    justify-self: flex-start;
    padding-bottom: $space-m;
}

.user-ctn {
    padding: $space-m;
    border-radius: $border-radius-m;
    min-height: pxToRem(300px);
    margin-top: $space-l;

    .result-boxes {
        display: flex;
        flex-direction: row;
    }
}

.loader-wrapper {
    display: flex;
    flex-grow: 1;
    align-items: center;
    justify-content: center;
}

.user-ctn,
.results-tabs,
:deep(.results-tabs .content) {
    display: flex;
    flex-flow: column nowrap;
    flex-grow: 1;
}
</style>

<style scoped lang="scss">
.see-more-btn {
    margin-bottom: 12px;
}
</style>
