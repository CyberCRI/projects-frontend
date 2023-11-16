<template>
    <div>
        <div class="intro">
            <div>
                <p>{{ $t('admin.groups.intro') }}</p>
            </div>
            <div class="action">
                <LinkButton
                    :label="$t('admin.groups.create-group')"
                    class="btn btn-create-link"
                    left-icon="Plus"
                    data-test="create-group"
                    :to="{
                        name: adminCreateGroup,
                    }"
                />
            </div>
        </div>
        <div class="loader" v-if="loading">
            <LoaderSimple />
        </div>
        <div class="list">
            <GroupsElement
                v-for="group in groups"
                :key="group.id"
                :group="group"
                @move="moveGroup"
            />
        </div>
        <PickGroupDrawer
            :drawer-title="modalTitle"
            :subtitle="subtitle"
            @close="closeDrawer"
            @confirm="confirmGroup"
            :is-opened="groupToBeAdded || groupToBeEdited"
            :groups="groups"
            :initial-group="initialGroup"
            :forbidden-ids="forbiddenIds"
            :rooted="groupToBeEdited"
        />
    </div>
</template>

<script>
import { getHierarchyGroups } from '@/api/group.service.ts'
import LinkButton from '@/components/lpikit/LpiButton/LinkButton.vue'
import GroupsElement from './GroupsElement.vue'
import PickGroupDrawer from '@/components/lpikit/PickGroupDrawer/PickGroupDrawer.vue'
import LoaderSimple from '@/components/lpikit/Loader/LoaderSimple.vue'

export default {
    name: 'GroupsListTab',
    components: {
        LinkButton,
        GroupsElement,
        PickGroupDrawer,
        LoaderSimple,
    },

    data() {
        return {
            groups: [],
            loading: true,
            modalTitle: '',
            subtitle: '',
            groupToBeAdded: false,
            groupToBeEdited: false,
            parent: null,
            child: null,
            initialGroup: null,
            forbiddenIds: [],
        }
    },
    async mounted() {
        await this.loadGroups()
    },
    methods: {
        async loadGroups() {
            this.loading = true
            this.groups = (
                await getHierarchyGroups(this.$store.state.organizations.current.code)
            ).children

            this.loading = false
        },
        // keeping this (move child) for future needs
        // addGroup(group) {
        //     this.modalTitle =
        //         this.$t('admin.groups.add-modal-title-1') +
        //         group.name +
        //         this.$t('admin.groups.add-modal-title-2')
        //     this.subtitle = this.$t('admin.groups.subtitle-add-child')
        //     this.groupToBeAdded = true
        //     this.parent = group
        //     this.initialGroup = null // group
        //     this.forbiddenIds = [group.id] // cant be a parent of itself
        // },
        moveGroup(group) {
            this.modalTitle = this.$t('admin.groups.edit-modal-title')
            this.subtitle = this.$t('admin.groups.subtitle-edit-child')
            this.groupToBeEdited = true
            this.child = group
            this.initialGroup = this.findParent(group)
            this.forbiddenIds = [group.id] // cant be a child of itself
        },

        // keeping this (edit group) for future needs
        // editGroup(group) {
        //     this.$router.push(`/admin/groups/edit/${group.id}`)
        // },

        closeDrawer() {
            this.groupToBeAdded = false
            this.groupToBeEdited = false
        },

        async confirmGroup(group) {
            if (this.groupToBeAdded) {
                this.child = group
            } else if (this.groupToBeEdited) {
                this.parent = group
            }
            const orgCode = this.$store.getters['organizations/current'].code

            const body = {
                name: this.child.name,
                description: this.child.description,
                email: this.child.email,
                type: this.child.type,
                parent: this.parent?.id || null, // parent is null if it's a root group
                organization: orgCode,
            }
            const payload = {
                orgId: orgCode,
                groupId: this.child.id,
                body: body,
            }
            try {
                await this.$store.dispatch('groups/addParent', payload)

                this.loadGroups()
                this.$store.dispatch('notifications/pushToast', {
                    message: this.$t('toasts.group-added.success'),
                    type: 'success',
                })
            } catch (error) {
                this.$store.dispatch('notifications/pushToast', {
                    message: `${this.$t('toasts.group-added.error')} (${error})`,
                    type: 'error',
                })
            } finally {
                this.loading = false
            }
            this.groupToBeAdded = false
            this.groupToBeEdited = false
            this.child = null
            this.parent = null
        },

        findParent(target) {
            let parent = null
            function iterate(group) {
                if (group.children) {
                    group.children.forEach((child) => {
                        if (child.id === target.id) {
                            parent = group
                        } else {
                            iterate(child)
                        }
                    })
                }
            }
            this.groups.forEach((group) => {
                iterate(group)
            })
            return parent
        },
    },
}
</script>
<style lang="scss" scoped>
.loader {
    display: flex;
    justify-content: center;
    margin-top: $space-2xl;
    margin-bottom: $space-2xl;
}

.intro {
    display: flex;
    gap: $space-l;

    p {
        line-height: 1.6;
    }

    .action {
        flex-grow: 1;
    }
}

.list {
    margin-top: $space-2xl;
    display: flex;
    flex-direction: column;
    margin-inline: auto;
    width: 60%;
}

.btn-create-link {
    white-space: nowrap;
}
</style>
