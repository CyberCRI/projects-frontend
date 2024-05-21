<template>
    <section class="role-section">
        <LpiButton
            v-if="!isEditMode"
            :border="false"
            :label="$t('common.back')"
            :secondary="true"
            class="back-btn"
            btn-icon="ArrowLeft"
            @click="$emit('back-to-user-selection')"
        />
        <div class="tooltip-ctn">
            {{ $t('role.select') }}

            <ToolTip arrow class="color-tip" :hover="true" :interactive="false">
                <button class="question-mark tooltip">
                    <IconImage name="HelpCircle" />
                </button>
                <template #custom-content>
                    <div class="tooltip-div">
                        <ul class="list-ctn">
                            <li class="item">
                                <span class="item-bold">{{ $t('role.leader') }}</span
                                >: {{ $t('role.role-leader') }}
                            </li>
                            <li class="item">
                                <span class="item-bold">{{ $t('role.editor') }}</span
                                >: {{ $t('role.role-editor') }}
                            </li>
                            <li class="item">
                                <span class="item-bold">{{ $t('role.member') }}</span
                                >: {{ $t('role.role-member') }}
                            </li>
                        </ul>
                    </div>
                </template>
            </ToolTip>
        </div>
        <div class="role-option-list">
            <div v-for="user in userList" :key="user.id" class="role-options-item">
                <div>{{ user.given_name }} {{ user.family_name }}</div>
                <div class="role-block">
                    <div
                        v-for="roleOption in roleOptions"
                        :key="roleOption.value"
                        class="role-item"
                    >
                        <div class="radio-block">
                            <label class="form-control">
                                <input
                                    v-model="user.role"
                                    :value="roleOption.value"
                                    :data-test="roleOption.value"
                                    type="radio"
                                    @change="selectRole(user, roleOption.value)"
                                />{{ $filters.capitalize(roleOption.label) }}</label
                            >
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import LpiButton from '@/components/base/button/LpiButton.vue'
import IconImage from '@/components/base/media/IconImage.vue'
import ToolTip from '@/components/base/ToolTip.vue'

export default {
    name: 'GroupRoleSelection',

    emits: ['select-role', 'back-to-user-selection'],

    components: { LpiButton, IconImage, ToolTip },

    props: {
        selectedUsers: {
            type: Object,
            default: () => {},
        },

        isEditMode: {
            type: Boolean,
            default: false,
        },
    },

    data() {
        return {
            userList: [],
        }
    },

    mounted() {
        this.userList = [...this.selectedUsers]
        for (let i = 0; i < this.userList.length; i++) {
            if (this.userList[i].is_leader) this.userList[i].role = 'leaders'
            else if (this.userList[i].is_manager) this.userList[i].role = 'editors'
            else this.userList[i].role = 'members'
        }
        /* This is call is here to set up and update the user status on all parents */
        /* Also this used to be a watcher */
        this.$emit('select-role', this.userList)
    },

    computed: {
        roleOptions() {
            return [
                {
                    value: 'leaders',
                    label: this.$filters.capitalize(this.$t('group.role.leaders.label')),
                    dataTest: 'button-role-leader',
                    tip: this.$t('group.role.leaders.help'),
                    userKey: 'is_leader',
                },
                {
                    value: 'editors',
                    label: this.$filters.capitalize(this.$t('group.role.editors.label')),
                    dataTest: 'button-role-editor',
                    tip: this.$t('group.role.editors.help'),
                    userKey: 'is_editor',
                },
                {
                    value: 'members',
                    label: this.$filters.capitalize(this.$t('group.role.members.label')),
                    tip: this.$t('group.role.members.help'),
                    dataTest: 'button-role-members',
                    userKey: 'is_member',
                },
            ]
        },
    },

    methods: {
        selectRole(user, role) {
            const index = this.userList.findIndex((usr) => usr.id === user.id)

            this.userList[index].role = role
            this.userList[index].is_manager = role === 'editors'
            this.userList[index].is_leader = role === 'leaders'

            this.$emit('select-role', this.userList)
        },
    },
}
</script>

<style lang="scss" scoped>
.role-section {
    display: flex;
    flex-direction: column;
    align-items: center;

    .tooltip-ctn {
        padding: 24px 0;
    }

    .back-btn {
        align-self: flex-end;
    }

    label {
        font-size: $font-size-m;
        display: flex;
        align-items: center;
        flex-grow: 1;
    }
}

.color-tip {
    color: $black !important;
}

.tooltip-div {
    max-width: 20rem;
    white-space: break-spaces;
    padding: $space-m;
    text-align: center;
    line-height: 1.3;
    color: $black;

    .list-ctn {
        display: flex;
        flex-direction: column;
        align-items: flex-start;

        .item {
            text-align: start;
            padding: $space-2xs 0;

            &-bold {
                font-weight: 700;
            }
        }
    }
}

.question-mark {
    display: inline-block;
    position: relative;
    width: $font-size-m;
    height: $font-size-m;
    background-color: transparent;
    border: 0 none;
    vertical-align: text-top;
    margin-left: $space-m;

    svg {
        width: $font-size-m;
        fill: $primary-dark;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
}

.role-option-list {
    display: flex;
    flex-wrap: wrap;
    width: 100%;

    .role-options-item {
        display: flex;
        justify-content: space-between;
        width: 100%;
        padding: $space-l $space-m;
        border-top: $border-width-s solid $gray-10;
    }

    .role-block {
        display: inline-flex;

        .role-item {
            margin-right: $space-l;
        }
    }
}

.form-control {
    font-size: $font-size-m;
    color: $primary-dark;
    line-height: 12px;
    display: grid;
    grid-template-columns: 1em auto;
    gap: $space-m;
    font-weight: bold;
}

.form-control + .form-control {
    margin-top: 1em;
}

.form-control--disabled {
    color: $disabled;
    cursor: not-allowed;
}
</style>
