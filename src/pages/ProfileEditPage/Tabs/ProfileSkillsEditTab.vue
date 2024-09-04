<template>
    <div class="profile-edit-skills">
        <div class="initial-screen" v-if="isInitial">
            <p class="intro">
                {{ $t('profile.edit.skills.intro') }}
            </p>
            <div class="actions">
                <LpiButton
                    :label="$filters.capitalize($t('profile.edit.skills.skills.add'))"
                    btn-icon="Plus"
                    @click="openDrawer('skills', 'add')"
                    data-test="add-skills-button"
                />
                <LpiButton
                    :label="$filters.capitalize($t('profile.edit.skills.hobbies.add'))"
                    btn-icon="Plus"
                    @click="openDrawer('hobbies', 'add')"
                    data-test="add-hobbies-button"
                />
            </div>
        </div>
        <div class="following-screen" v-else>
            <div class="level-notice page-section-medium">
                <p>
                    {{ $t('profile.edit.skills.level-notice') }}
                    <SkillLevelTip>
                        <a href="#" data-test="skill-levels-help-button">{{
                            $t('profile.edit.skills.level-notice-more')
                        }}</a>
                    </SkillLevelTip>
                </p>
            </div>

            <div v-for="key in ['skills', 'hobbies']" :key="key" :class="key">
                <template v-if="getSkillOfType(key).length">
                    <div class="skill-list-header">
                        <h2 class="skill-list-title">
                            {{ $t(`profile.edit.skills.${key}.title`) }}
                        </h2>
                        <div class="skill-list-actions">
                            <ContextActionMenu
                                trigger-icon="Pen"
                                :trigger-label="$t('profile.edit.skills.handle')"
                            >
                                <ContextActionButton
                                    action-icon="Plus"
                                    :action-label="$t('profile.edit.skills.add-competences')"
                                    class="edit-btn small"
                                    secondary
                                    no-border
                                    @click.stop.prevent="openDrawer(key, 'add')"
                                    :data-test="`edit-${key}-button`"
                                />
                                <ContextActionButton
                                    action-icon="Pen"
                                    :action-label="$t('profile.edit.skills.modify-competences')"
                                    class="edit-btn small"
                                    secondary
                                    no-border
                                    @click.stop.prevent="openDrawer(key, 'edit')"
                                    data-test="edit-levels-button"
                                />
                                <ContextActionButton
                                    action-icon="School"
                                    :action-label="$t('profile.edit.skills.become-mentor')"
                                    class="edit-btn small"
                                    secondary
                                    no-border
                                    @click.stop.prevent=""
                                />
                                <ContextActionButton
                                    action-icon="HumanMaleChild"
                                    :action-label="$t('profile.edit.skills.become-mentee')"
                                    class="edit-btn small"
                                    secondary
                                    no-border
                                    @click.stop.prevent="askMentorship = true"
                                />
                            </ContextActionMenu>
                        </div>
                    </div>

                    <div class="skill-list">
                        <UserSkills
                            is-editable
                            :full-list="true"
                            :skills="getSkillOfType(key)"
                            title=""
                            @edit-skill="openDrawer(key, 'edit', $event)"
                            @delete-skill="deleteSkill($event, key)"
                        />
                    </div>
                </template>
                <div v-else class="add-action">
                    <LpiButton
                        :label="$filters.capitalize($t(`profile.edit.skills.${key}.add`))"
                        btn-icon="Plus"
                        :secondary="false"
                        @click="openDrawer(key, 'add')"
                        :data-test="`add-${key}-button`"
                    />
                </div>
            </div>
        </div>
    </div>
    <SkillsEditDrawer
        :is-open="drawerIsOpen"
        :user="user"
        :mode="drawerMode"
        :type="drawerType"
        :filter="editSkillFilter"
        @close="closeDrawer"
        @switch-mode="drawerMode = $event"
        @skills-updated="$emit('profile-edited')"
    />
    <ConfirmModal
        v-if="skillToDelete"
        :content="
            $t('profile.edit.skills.delete-confirm-body', {
                name: skillToDelete.wikipedia_tag.name,
                type: $t(`profile.edit.skills.${typeToDelete}.type-plural`),
            })
        "
        :title="
            $t('profile.edit.skills.delete-confirm-title', {
                type: $t(`profile.edit.skills.${typeToDelete}.type-singular`),
            })
        "
        cancel-button-label="common.cancel"
        confirm-button-label="common.delete"
        @cancel="skillToDelete = null"
        @confirm="onDeleteSkillConfirmed"
        :asyncing="deletingSkill"
    />
    <MentorshipAskDrawer :is-open="askMentorship" @close="askMentorship = false" />
</template>
<script>
import LpiButton from '@/components/base/button/LpiButton.vue'
import SkillsEditDrawer from '@/components/people/skill/SkillsEditDrawer.vue'
import SkillLevelTip from '@/components/people/skill/SkillLevelTip.vue'
import UserSkills from '@/components/people/skill/UserSkills.vue'
import ContextActionMenu from '@/components/base/button/ContextActionMenu.vue'
import ContextActionButton from '@/components/base/button/ContextActionButton.vue'
import { deleteUserSkill } from '@/api/people.service.ts'
import ConfirmModal from '@/components/base/modal/ConfirmModal.vue'
import MentorshipAskDrawer from '@/components/people/skill/MentorshipAskDrawer.vue'
export default {
    name: 'ProfileSkillsEditTab',

    emits: ['edited', 'profile-edited'],

    inject: {
        reloadUser: {
            from: 'profileEditReloadUser',
            default: () => () => {},
        },
    },

    components: {
        LpiButton,
        SkillsEditDrawer,
        SkillLevelTip,
        UserSkills,
        ContextActionMenu,
        ContextActionButton,
        ConfirmModal,
        MentorshipAskDrawer,
    },

    props: {
        user: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            drawerType: 'skills', // skills | hobbies
            drawerMode: 'add', // add | edit
            drawerIsOpen: false,
            editSkillFilter: null,
            skillToDelete: null,
            typeToDelete: null,
            deletingSkill: false,
            askMentorship: false,
        }
    },
    computed: {
        isInitial() {
            return (
                !this.user ||
                ((!this.skills || this.skills.length === 0) &&
                    (!this.hobbies || this.hobbies.length === 0))
            )
        },
        allSkills() {
            return this.user.skills || []
        },
        skills() {
            return this.allSkills.filter((s) => s.type === 'skill')
        },
        hobbies() {
            return this.allSkills.filter((s) => s.type === 'hobby')
        },
    },

    methods: {
        openDrawer(type, mode, filter = null) {
            this.editSkillFilter = filter?.wikipedia_tag?.wikipedia_qid || null
            this.drawerType = type
            this.drawerMode = mode
            this.drawerIsOpen = true
        },
        closeDrawer() {
            this.drawerIsOpen = false
            this.$emit('edited')
        },

        getSkillOfType(type) {
            if (type == 'skills') return this.skills
            else return this.hobbies
        },

        deleteSkill(skill, type) {
            this.typeToDelete = type
            this.skillToDelete = skill
        },

        async onDeleteSkillConfirmed() {
            this.deletingSkill = true
            try {
                await deleteUserSkill(this.skillToDelete?.id)
                this.skillToDelete = null
                await this.reloadUser()
                this.$store.dispatch('notifications/pushToast', {
                    message: this.$t('profile.edit.skills.save-success'),
                    type: 'success',
                })
            } catch (error) {
                this.$store.dispatch('notifications/pushToast', {
                    message: `${this.$t('profile.edit.skills.save-error')} (${error})`,
                    type: 'error',
                })
                console.error(error)
            } finally {
                this.deletingSkill = false
            }
        },
    },
}
</script>
<style scoped lang="scss">
@import './profile-form';

.profile-edit-skills {
    margin: 0 auto;
}

.initial-screen {
    .intro {
        margin-top: $space-xl;
        text-align: center;
        font-size: $font-size-m;
    }

    .actions {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: $space-unit;
        margin-top: $space-xl;
    }
}

.following-screen {
    .add-action {
        margin-top: $space-xl;
        display: flex;
        justify-content: center;
        align-items: center;
    }
}

.skill-list-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: $space-l;
    margin-bottom: $space-m;

    .skill-list-title {
        font-size: $font-size-l;
        font-weight: 700;
        color: $primary-dark;
    }
}

.level-notice {
    margin-top: $space-unit;
    margin-bottom: $space-2xl;

    a {
        font-weight: 700;
        color: $primary-dark;
        text-decoration: underline;
    }
}
</style>
