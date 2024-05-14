<template>
    <div class="team-section">
        <label>
            <span class="section-title">
                {{ $filters.capitalize($t('team.project-members')) }}
                <span v-if="projectUsers.length">({{ projectUsers.length }})</span>
            </span>
            <span
                class="add-user-card"
                :class="{ disabled: unfocusable }"
                @click="teamModalVisible = true"
                :v-disable-focus="unfocusable"
            >
                <IconImage name="Plus" />
                <span>{{ $filters.capitalize($t('team.add')) }}</span>
            </span>
        </label>

        <div v-if="currentUser" class="team-grid">
            <TeamCardInline
                v-for="(user, index) in projectUsers"
                :key="index"
                :role-label="roleLabel(user.role)"
                :user="user.user"
                @user-clicked="removeUser(user)"
            ></TeamCardInline>
        </div>

        <TeamDrawer
            v-if="teamModalVisible"
            :add-to-current-project="false"
            :current-users="projectUsers"
            :is-opened="teamModalVisible"
            :selected-category="selectedCategory"
            @close="teamModalVisible = false"
            @add-user="addUser"
        />
    </div>
</template>

<script>
import TeamDrawer from '@/components/project/TeamDrawer/TeamDrawer.vue'
import IconImage from '@/components/base/media/IconImage.vue'
import { mapGetters } from 'vuex'
import TeamCardInline from '@/components/lpikit/TeamCard/TeamCardInline.vue'

export default {
    name: 'TeamSection',

    emits: ['update-team'],

    props: {
        selectedCategory: {
            type: Object,
            default: () => {},
        },
        unfocusable: {
            type: Boolean,
            default: false,
        },
    },

    components: {
        TeamCardInline,
        TeamDrawer,
        IconImage,
    },

    computed: {
        ...mapGetters({
            currentUser: 'users/userFromApi',
        }),

        adaptedCurrentUser() {
            /* Only selecting what we need for the card */
            return {
                id: this.currentUser.id,
                family_name: this.currentUser.family_name,
                given_name: this.currentUser.given_name,
                job: this.currentUser.job,
                people_id: this.currentUser.people_id,
                profile_picture: this.currentUser.profile_picture,
            }
        },
    },

    watch: {
        currentUser: {
            handler: function (neo) {
                if (neo) {
                    this.projectUsers.push({ user: this.adaptedCurrentUser, role: 'owners' })
                    this.$emit('update-team', this.projectUsers)
                }
            },
            immediate: true,
        },
    },

    data() {
        return {
            projectUsers: [],
            teamModalVisible: false,
        }
    },

    methods: {
        addUser(payload) {
            payload.forEach((user) => {
                if (this.$filters.isNotGroup(user)) {
                    // current user is automatically added as owner
                    // so dont duplicate him
                    if (user.id !== this.currentUser.id) {
                        this.projectUsers.push({
                            user: user,
                            role: user.role,
                        })
                    }
                } else {
                    this.projectUsers.push({
                        user: user,
                        role: 'people_groups',
                    })
                }
            })

            this.$emit('update-team', this.projectUsers)
        },

        removeUser(user) {
            const userIndexToDelete = this.projectUsers.findIndex((projectUser) => {
                return projectUser.user.id === user.user.id
            })
            this.projectUsers.splice(userIndexToDelete, 1)
            this.$emit('update-team', this.projectUsers)
        },

        roleLabel(role) {
            if (role) {
                if (role === 'owners') return 'role.editor'
                else if (role === 'members') return 'role.teammate'
                else if (role === 'reviewers') return 'role.reviewer'
            }
            return null
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
        color: $gray-6;

        svg {
            width: 18px;
            fill: $gray-6;
        }
    }
}
</style>
