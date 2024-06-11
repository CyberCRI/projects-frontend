<template>
    <div class="sub-section" ref="groups">
        <h2 class="title">{{ $t('account.form.groups') }}</h2>
        <p class="sub-title">{{ $t('account.form.groups-description') }}</p>

        <div class="current-groups-ctn">
            <div v-for="(role, groupId) in modelValue" :key="groupId">
                <FilterValue
                    v-if="role"
                    :label="peopleGroupsIndex[groupId].name"
                    class="actionable"
                    icon="Close"
                    @click="addRemovePeopleGroup(groupId)"
                />
            </div>
        </div>

        <ul>
            <GroupHierarchyList
                v-for="peopleGroup in peopleGroupsTree"
                :key="peopleGroup.id"
                :parent="peopleGroup"
                @add-group="addRemovePeopleGroup"
            >
                <LpiCheckbox
                    :class="{
                        'list-label--has-children': peopleGroup.children.length > 0,
                    }"
                    :label="peopleGroup.name"
                    :model-value="!!modelValue[peopleGroup.id]"
                    @update:model-value="addRemovePeopleGroup(peopleGroup.id)"
                />
            </GroupHierarchyList>
        </ul>
    </div>

    <div class="sub-section">
        <h2 class="title">{{ $t('account.form.groups-roles') }}</h2>
        <p class="sub-title">{{ $t('account.form.groups-roles-description') }}</p>

        <div class="group-rights">
            <template v-for="(role, groupId) in modelValue">
                <div v-if="role" :key="groupId" class="group-item">
                    <p class="group-name">{{ peopleGroupsIndex[groupId].name }}</p>
                    <div class="check-box-items">
                        <template v-for="roleOption in roleOptions" :key="roleOption.value">
                            <div class="item">
                                <LpiCheckbox
                                    :label="roleOption.label"
                                    :model-value="modelValue[groupId] === roleOption.value"
                                    @update:model-value="setRole(groupId, roleOption.value)"
                                />
                            </div>
                        </template>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>
<script>
import GroupHierarchyList from '@/components/people/Account/GroupHierarchyList.vue'
import FilterValue from '@/components/search/Filters/FilterValue.vue'
import LpiCheckbox from '@/components/base/form/LpiCheckbox.vue'
import { getPeopleGroupsHierarchy } from '@/api/organizations.service'
export default {
    name: 'AccountGroupsForm',

    emits: ['update:modelValue'],

    components: { GroupHierarchyList, FilterValue, LpiCheckbox },

    props: {
        modelValue: {
            type: Object, // map {[groupid]: 'members'|'leaders'|'editors'|false}
            required: true,
        },
    },

    data() {
        return {
            peopleGroupsTree: [],
            peopleGroupsIndex: {},
        }
    },

    computed: {
        roleOptions() {
            return [
                {
                    value: 'leaders',
                    label: this.$filters.capitalize(this.$t('group.role.leaders.label')),
                    dataTest: 'button-role-leader',
                    tip: this.$t('group.role.leaders.help'),
                },
                {
                    value: 'editors',
                    label: this.$filters.capitalize(this.$t('group.role.editors.label')),
                    dataTest: 'button-role-editor',
                    tip: this.$t('group.role.editors.help'),
                },
                // {
                //     value: 'members',
                //     label: this.$filters.capitalize(this.$t('group.role.members.label')),
                //     tip: this.$t('group.role.members.help'),
                //     dataTest: 'button-role-members',
                // },
            ]
        },
    },

    async mounted() {
        await this.setSelectedHierarchyGroups()
    },

    methods: {
        setSelectedHierarchyGroups() {
            // We get the current org group hierarchy and we selected the groups already added to the user.
            getPeopleGroupsHierarchy(this.$store.getters['organizations/current'].code, {
                organizations: this.$store.getters['organizations/current'].code,
            }).then((peopleGroupsHierarchy) => {
                this.peopleGroupsTree = this.setGroupHierarchy(peopleGroupsHierarchy.children)
            })
        },

        setGroupHierarchy(children) {
            // this is a recursive call, as the groups have children, that have children, ...
            if (children && children.length > 0) {
                children.forEach((child) => {
                    this.peopleGroupsIndex[child.id] = child
                })
                // TODO why ????
                return children.map((child) => ({
                    ...child,
                    // value: false,
                    children: this.setGroupHierarchy(child.children),
                }))
            }

            return []
        },

        addRemovePeopleGroup(groupId) {
            if (this.modelValue[groupId])
                this.$emit('update:modelValue', { ...this.modelValue, [groupId]: false })
            else this.$emit('update:modelValue', { ...this.modelValue, [groupId]: 'members' })
        },

        setRole(groupId, role) {
            if (this.modelValue[groupId] === role)
                this.$emit('update:modelValue', { ...this.modelValue, [groupId]: 'members' })
            else this.$emit('update:modelValue', { ...this.modelValue, [groupId]: role })
        },
    },
}
</script>
<style lang="scss" scoped>
.current-groups-ctn {
    display: flex;
    flex-wrap: wrap;
    gap: $space-s;
    margin-bottom: $space-l;
}

.title {
    font-weight: 700;
    font-size: $font-size-l;
    color: $black;
    line-height: $line-height-tight;
}

.sub-section {
    padding-top: $space-xl;

    .title {
        font-weight: 700;
        font-size: $font-size-l;
        color: $black;
    }

    .sub-title {
        margin: pxToRem(16px) 0;
    }
}

.list-label {
    font-size: $font-size-s;

    &--has-children {
        font-weight: 700;
        color: $primary-dark;
    }
}

.label {
    font-weight: 500;
    font-size: $font-size-m;
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
        padding: 1rem 0;
    }

    .group-item + .group-item {
        border-top: $border-width-s solid $lighter-gray;
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
</style>
