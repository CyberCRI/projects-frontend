<template>
    <BaseDrawer
        :confirm-action-name="$t('common.save')"
        :is-opened="isOpenEditRoleDrawer"
        :title="$t('groups.title')"
        class="small"
        @close="$emit('close')"
        @confirm="patchUser"
    >
        <template v-for="roleOption in roleOptions">
            <div v-if="roleOption" :key="roleOption.value">
                <div class="checkbox-item">
                    <label class="form-control">
                        <input v-model="selectedRole" :value="roleOption" type="radio" />
                        {{ $filters.capitalize($t(`groups.roles.${roleOption.name}`)) }}
                    </label>
                    <ToolTip :hover="true" :interactive="false" :placement="left">
                        <IconImage class="icon" name="HelpCircleOutline" />
                        <template #custom-content>
                            <div class="tooltip-div">
                                {{ $t(`groups.${roleOption.name}`) }}
                            </div>
                        </template>
                    </ToolTip>
                </div>
            </div>
        </template>
    </BaseDrawer>
</template>

<script>
import BaseDrawer from '@/components/base/BaseDrawer.vue'
import IconImage from '@/components/base/media/IconImage.vue'

import ToolTip from '@/components/base/ToolTip.vue'

export default {
    name: 'RolesDrawer',

    emits: ['close', 'confirm'],

    components: {
        BaseDrawer,
        IconImage,
        ToolTip,
    },

    props: {
        isOpenEditRoleDrawer: {
            type: Boolean,
            required: true,
        },

        selectedUser: {
            type: Object,
            required: true,
        },
    },

    data() {
        return {
            selectedRole: {},
            roleOptions: [],
        }
    },

    async mounted() {
        if (!this.isOpenEditRoleDrawer) {
            this.selectedRole = null
        }

        if (this.selectedUser) {
            const result = await this.$store.dispatch(
                'groups/getGroups',
                this.$store.getters['organizations/current'].id
            )

            const groups = [...result.results]

            this.roleOptions = [
                {
                    id: 0,
                    name: 'none',
                },
                ...groups.reverse(),
            ]

            if (this.selectedUser.current_org_role)
                this.selectedRole = this.roleOptions.find(
                    (group) => group.name === this.selectedUser.current_org_role
                )
            else
                this.selectedRole = {
                    id: 0,
                    name: 'none',
                }
        }
    },

    computed: {
        organization() {
            return this.$store.getters['organizations/current']
        },
    },

    methods: {
        patchUser() {
            if (this.selectedRole.id !== 0) {
                this.$store
                    .dispatch('organizations/addGroupMember', {
                        org_id: this.organization.code,
                        body: {
                            name: this.selectedRole.name,
                            user: this.selectedUser.id,
                        },
                    })
                    .then(async () => {
                        this.$emit('confirm')
                    })
            } else {
                this.$store
                    .dispatch('organizations/removeGroupMember', {
                        org_id: this.organization.code,
                        body: {
                            users: [this.selectedUser.id],
                        },
                    })
                    .then(async () => {
                        this.$emit('confirm')
                    })
            }
        },
    },
}
</script>

<style lang="scss" scoped>
.icon {
    width: 24px;
    height: 24px;
    fill: $primary-dark;
    margin-left: 8px;
}

.tooltip-div {
    max-width: 20rem;
    white-space: break-spaces;
    padding: $space-2xs;
    text-align: center;
}
</style>
