<template>
    <div class="team-section">
        <label>
            <span class="section-title">
                {{ $filters.capitalize($t('team.group-members')) }}
                <span v-if="modelValue.length">({{ modelValue.length }})</span>
            </span>
            <span
                v-if="!modelValue.length"
                class="add-user-card"
                @click="openDrawer('select')"
                data-test="add-members"
            >
                <IconImage name="Plus" />
                <span>{{ $filters.capitalize($t('group.form.add')) }}</span>
            </span>
            <template v-else>
                <span class="add-user-card" @click="openDrawer('select')" data-test="add-members">
                    <IconImage name="Pen" />
                    <span>{{ $filters.capitalize($t('group.form.edit-members')) }}</span>
                </span>
                <span class="add-user-card" @click="openDrawer('roles')" data-test="edit-roles">
                    <IconImage name="Pen" />
                    <span>{{ $filters.capitalize($t('group.form.edit-roles')) }}</span>
                </span>
            </template>
        </label>

        <div class="team-grid">
            <TeamCardInline
                v-for="user in showFullList ? modelValue : shortList"
                :key="user.id"
                icon="Close"
                :role-label="roleLabel(user)"
                :user="user"
                @user-clicked="removeUser(user)"
            ></TeamCardInline>
        </div>
        <div class="show-more">
            <LinkButton
                v-if="shortList?.length < modelValue?.length"
                class="see-more-btn"
                :label="$filters.capitalize($t(seeMoreLabel))"
                @click="showFullList = !showFullList"
            />
        </div>

        <GroupTeamDrawer
            v-if="teamModalVisible"
            :current-users="modelValue"
            :is-opened="teamModalVisible"
            :mode="teamModalMode"
            @close="teamModalVisible = false"
            @add-user="addUsers"
            @set-mode="teamModalMode = $event"
        />
    </div>
</template>

<script>
import GroupTeamDrawer from '@/components/people/GroupTeamDrawer/GroupTeamDrawer.vue'
import IconImage from '@/components/base/media/IconImage.vue'
import { mapGetters } from 'vuex'
import TeamCardInline from '@/components/people/TeamCard/TeamCardInline.vue'
import LinkButton from '@/components/base/button/LinkButton.vue'

export default {
    name: 'GroupTeamSection',

    emits: ['update-team', 'remove-user', 'update:model-value'],

    components: {
        TeamCardInline,
        GroupTeamDrawer,
        IconImage,
        LinkButton,
    },

    props: {
        modelValue: {
            type: Array,
            required: true,
        },
    },

    data() {
        return {
            groupMembers: [],
            teamModalVisible: false,
            teamModalMode: 'select', // 'select' or 'roles'
            showFullList: false,
        }
    },

    computed: {
        ...mapGetters({
            currentUser: 'users/userFromApi',
        }),

        shortList() {
            return this.modelValue.slice(0, 8)
        },

        adaptedCurrentUser() {
            /* Only selecting what we need for the card and also not selecting
             * the keycloak_id, so we don't add this user to the API call
             */
            return {
                family_name: this.currentUser.family_name,
                given_name: this.currentUser.given_name,
                job: this.currentUser.job,
                people_id: this.currentUser.people_id,
            }
        },
        seeMoreLabel() {
            return this.showFullList ? 'common.see-less' : 'common.see-more'
        },
    },

    watch: {
        currentUser: {
            handler: function (neo) {
                if (neo) {
                    this.groupMembers.push({ user: this.adaptedCurrentUser, role: 'owners' })
                    this.$emit('update-team', this.groupMembers)
                }
            },
            immediate: true,
        },
    },

    methods: {
        addUsers(team) {
            this.$emit('update:model-value', team)
        },

        removeUser(user) {
            // const userIndexToDelete = this.groupMembers.findIndex((projectUser) => {
            //     return projectUser.user.id === user.user.id
            // })
            // this.groupMembers.splice(userIndexToDelete, 1)
            const team = this.modelValue.filter((member) => user.id !== member.id)
            this.$emit('update:model-value', team)
        },
        roleLabel(user) {
            if (user) {
                if (user.is_leader && user.is_manager) return 'group.role.leaders-managers.label'
                else if (user.is_manager) return 'group.role.managers.label'
                else if (user.is_leader) return 'group.role.leaders.label'
                else return 'group.role.members.label'
            }
            return null
        },
        openDrawer(mode) {
            this.teamModalMode = mode
            this.teamModalVisible = true
        },
    },
}
</script>

<style lang="scss" scoped>
.team-section {
    label {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-direction: row;
        width: 100%;
        font-size: $font-size-m;
        margin-bottom: $space-l;

        .section-title {
            color: $black;
            font-weight: bold;
            display: block;
        }
    }

    .team-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        justify-items: stretch;
        gap: $space-l;
    }

    .add-user-card {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        background: $white;
        color: $primary-dark;
        cursor: pointer;
        font-weight: 700;
        font-size: 16px;

        svg {
            width: 18px;
            fill: $primary-dark;
        }
    }

    .disabled {
        color: $almost-white;

        svg {
            width: 18px;
            fill: $almost-white;
        }
    }

    .show-more {
        display: flex;
        justify-content: center;
        margin-top: $space-l;
    }
}
</style>
