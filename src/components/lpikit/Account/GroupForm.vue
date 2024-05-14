<template>
    <div class="sub-section" ref="groups">
        <h2 class="title">{{ $t('account.form.groups') }}</h2>
        <p class="sub-title">{{ $t('account.form.groups-description') }}</p>

        <div v-if="selectedPeopleGroups.length > 0" class="current-groups-ctn">
            <div v-for="group in selectedPeopleGroups" :key="group.id">
                <FilterValue
                    :label="group.name"
                    class="actionable"
                    icon="Close"
                    @click="addRemovePeopleGroup(group)"
                />
            </div>
        </div>

        <ul>
            <GroupHierarchyList
                v-for="peopleGroup in peopleGroups"
                :key="peopleGroup.id"
                :parent="peopleGroup"
                @add-group="addRemovePeopleGroup"
            >
                <input
                    type="checkbox"
                    :id="peopleGroup.id"
                    :name="peopleGroup.name"
                    :checked="peopleGroup.value"
                    @change="addRemovePeopleGroup(peopleGroup)"
                />
                <label
                    :for="peopleGroup.id"
                    class="list-label"
                    :class="{
                        'list-label--has-children': peopleGroup.children.length > 0,
                    }"
                    >{{ peopleGroup.name }}</label
                >
            </GroupHierarchyList>
        </ul>

        <div v-if="!isAddMode">
            <h2 class="title">Group leader & editor</h2>
            <p class="sub-title">This user will be the group admin of the following group(s):</p>

            <div class="group-rights">
                <div v-for="group in selectedPeopleGroups" :key="group.name" class="group-item">
                    <p class="group-name">{{ group.name }}</p>
                    <div class="check-box-items">
                        <template v-for="role in group.roles" :key="role">
                            <div class="item" v-if="role.split(':')[2] !== 'members'">
                                <input
                                    type="checkbox"
                                    :name="role.name"
                                    :checked="adaptedUserRoles.indexOf(role) > -1"
                                    @change="addRemoveGroupRight($event, group, role)"
                                />
                                <label :for="role.split(':')[2]" class="list-label">{{
                                    role.split(':')[2].slice(0, -1)
                                }}</label>
                            </div>
                        </template>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import FilterValue from '@/components/lpikit/Filters/FilterValue.vue'
import GroupHierarchyList from '@/components/lpikit/Account/GroupHierarchyList.vue'
import {
    addUserPeopleGroup,
    getPeopleGroupsHierarchy,
    removeUserPeopleGroup,
} from '@/api/organizations.service'
import { getUser } from '@/api/people.service.ts'

export default {
    name: 'GroupForm',
    components: { GroupHierarchyList, FilterValue },

    props: {
        isAddMode: {
            type: Boolean,
            default: true,
        },

        selectedUser: {
            type: Object,
            default: null,
        },
    },

    data() {
        return {
            selectedPeopleGroups: [],
            peopleGroups: [],

            adaptedUserGroups: [],
            adaptedUserRoles: [],
        }
    },

    mounted() {
        this.setAdaptedUserGroups(this.selectedUser)
        this.setAdaptedUserPeopleGroupsRoles(this.selectedUser)

        this.setSelectedHierarchyGroups()
    },

    methods: {
        setAdaptedUserGroups(user) {
            // User's people groups
            const entries = Object.fromEntries(user.people_groups.entries())
            const mappedIds = Object.keys(entries).map((key) => [entries[key].id, entries[key]])

            this.adaptedUserGroups = Object.fromEntries(mappedIds)
        },

        setAdaptedUserPeopleGroupsRoles(user) {
            // Current user roles, misnamed groups in user object
            const groups = user.roles.filter((role) => role.split(':')[0] === 'peoplegroup')
            this.adaptedUserRoles = groups
        },

        setSelectedHierarchyGroups() {
            // We get the current org group hierarchy and we selected the groups already added to the user.
            getPeopleGroupsHierarchy(this.$store.getters['organizations/current'].code, {
                organizations: this.$store.getters['organizations/current'].code,
            }).then((peopleGroupsHierarchy) => {
                this.peopleGroups = this.setGroupHierarchy(peopleGroupsHierarchy.children)
            })
        },

        setGroupHierarchy(children) {
            // this is a recursive call, as the groups have children, that have children, ...
            if (children && children.length > 0)
                return children.map((child) => ({
                    ...child,
                    value: this.addToSelectedGroups(child),
                    children: this.setGroupHierarchy(child.children),
                }))

            return []
        },

        addToSelectedGroups(group) {
            // this here, sets the value of the checkbox in the tree
            if (this.adaptedUserGroups[group.id])
                // We also take the opportunity for every group to add them to the selected groups
                this.selectedPeopleGroups.push({
                    ...group,
                    groups: this.adaptRoles(group.roles),
                })

            // this sends true if the entry exists in the user's people groups
            return !!this.adaptedUserGroups[group.id]
        },

        async addRemovePeopleGroup(group) {
            const index = this.selectedPeopleGroups.findIndex((grp) => grp.id === group.id)

            if (index !== -1) {
                await removeUserPeopleGroup(
                    this.$store.getters['organizations/current'].code,
                    group.id,
                    {
                        users: [this.selectedUser.id],
                    }
                )
                this.selectedPeopleGroups.splice(index, 1)
            } else {
                await addUserPeopleGroup(
                    this.$store.getters['organizations/current'].code,
                    group.id,
                    {
                        members: [this.selectedUser.id],
                    }
                )
                this.selectedPeopleGroups.push({
                    ...group,
                    groups: this.adaptRoles(group.roles),
                })
            }
        },

        adaptRoles(roles) {
            let index = null
            for (let i = 0; i < roles.length; i++) {
                if (roles[i].split(':')[2] === 'managers') {
                    index = roles.indexOf(roles[i])
                    break
                }
            }
            roles.push(roles.splice(index, 1)[0])

            return roles
        },

        async addRemoveGroupRight(event, group, role) {
            const currentRole = this.adaptedUserRoles.indexOf(role) > -1 ? role : null

            const type = role.split(':')[2]
            if (currentRole) {
                if (currentRole.split(':')[2] === 'managers') {
                    await addUserPeopleGroup(
                        this.$store.getters['organizations/current'].code,
                        group.id,
                        {
                            members: [this.selectedUser.id],
                        }
                    )
                } else {
                    const body = {
                        roles_to_remove: [role],
                    }
                    await this.$store.dispatch('users/patchUser', {
                        id: this.selectedUser.id,
                        body,
                    })
                }
            } else {
                if (type === 'managers') {
                    await addUserPeopleGroup(
                        this.$store.getters['organizations/current'].code,
                        group.id,
                        {
                            managers: [this.selectedUser.id],
                        }
                    )
                } else {
                    await addUserPeopleGroup(
                        this.$store.getters['organizations/current'].code,
                        group.id,
                        {
                            leaders: [this.selectedUser.id],
                        }
                    )
                }
            }

            getUser(this.selectedUser.id).then((user) => {
                this.setAdaptedUserPeopleGroupsRoles(user)
            })
        },
    },
}
</script>

<style scoped lang="scss">
.sub-section {
    .title {
        font-weight: 700;
        font-size: $font-size-l;
        color: $black;
        line-height: 24px;
    }

    .sub-title {
        margin: pxToRem(16px) 0;
    }

    .list-label {
        font-size: $font-size-s;
        line-height: 16px;

        &--has-children {
            font-weight: 700;
            color: $primary-dark;
        }
    }

    .label {
        font-weight: 500;
        font-size: $font-size-m;
        line-height: 18px;
        padding-bottom: $space-m;
    }

    .current-groups-ctn {
        display: flex;
        flex-wrap: wrap;
        gap: $space-s;
        margin-bottom: $space-l;
    }

    .group-rights {
        .group-item {
            display: inline-flex;
            width: 100%;
            justify-content: space-between;
            border-bottom: 1px solid #d4d4d4;
            padding: 16px 0;
        }

        .group-name {
            flex: 33%;
        }

        .check-box-items {
            display: inline-flex;
            width: 100%;
            flex: 66%;
            justify-content: space-around;

            .item {
                color: $primary-dark;
                font-weight: bold;
                display: inline-flex;
                align-items: center;
            }
        }
    }
}
</style>
