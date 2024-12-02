<template>
    <div class="profile-edit-skills">
        <div class="initial-screen" v-if="isInitial">
            <p class="intro">
                {{ $t('profile.edit.skills.intro') }}
            </p>
            <div class="actions">
                <LpiButton
                    :label="$filters.capitalize($t('profile.edit.skills.skills.add-item'))"
                    btn-icon="Plus"
                    @click="openDrawer('skills', 'add')"
                    data-test="initial-add-skills-button"
                />
                <LpiButton
                    :label="$filters.capitalize($t('profile.edit.skills.hobbies.add-item'))"
                    btn-icon="Plus"
                    @click="openDrawer('hobbies', 'add')"
                    data-test="initial-add-hobbies-button"
                />
            </div>
        </div>
        <div class="following-screen" v-else>
            <div v-for="key in ['skills', 'hobbies']" :key="key" :class="key">
                <template v-if="getSkillOfType(key).length">
                    <h3 class="talent-title">{{ $t(`profile.edit.skills.${key}.selection`) }}</h3>
                    <div class="actions">
                        <LinkButton
                            :label="$filters.capitalize($t(`profile.edit.skills.${key}.add-item`))"
                            btn-icon="Plus"
                            @click="openDrawer(key)"
                            :data-test="`add-${key}-button`"
                        />

                        <SkillLevelTip>
                            <LinkButton
                                :label="
                                    $filters.capitalize(
                                        $t(`profile.edit.skills.${key}.levels-help`)
                                    )
                                "
                                btn-icon="HelpCircle"
                                data-test="skill-levels-help-button"
                            />
                        </SkillLevelTip>
                    </div>
                    <TransitionGroup tag="div" name="skill" class="level-editor-list">
                        <SkillEditor
                            v-for="skill in getSkillOfType(key)"
                            :key="skill.id"
                            :skill="skill"
                            :type="key"
                            :data-skill-id="skill.id"
                            @set-level="setTalentLevel(key, $event.skill, $event.level)"
                            @delete="removeTalent(key, $event)"
                            :scroll-into-view="lastAddedTalent === skill.id"
                        />
                    </TransitionGroup>
                </template>
                <div v-else class="add-action">
                    <LpiButton
                        :label="$filters.capitalize($t(`profile.edit.skills.${key}.add-item`))"
                        btn-icon="Plus"
                        :secondary="false"
                        @click="openDrawer(key, 'add')"
                        :data-test="`initial-add-${key}-button`"
                    />
                </div>
            </div>
        </div>
    </div>
    <SkillsEditDrawer
        :is-open="drawerIsOpen"
        :user="user"
        :type="drawerType"
        @close="closeDrawer"
        @switch-mode="drawerMode = $event"
        @skill-added="onSkillAdded"
    />
</template>
<script>
import LpiButton from '@/components/base/button/LpiButton.vue'
import LinkButton from '@/components/base/button/LinkButton.vue'
import SkillsEditDrawer from '@/components/people/skill/SkillsEditDrawer.vue'
import SkillLevelTip from '@/components/people/skill/SkillLevelTip.vue'
import { patchUserSkill, deleteUserSkill } from '@/api/people.service.ts'
import useToasterStore from '@/stores/useToaster.ts'
import SkillEditor from '@/components/people/skill/SkillEditor.vue'
import useSkillTexts from '@/composables/useSkillTexts.js'
import useSkillLevels from '@/composables/useSkillLevels.js'
export default {
    name: 'ProfileSkillsEditTab',
    components: {
        LpiButton,
        SkillsEditDrawer,
        SkillLevelTip,
        LinkButton,
        SkillEditor,
    },

    emits: ['edited', 'profile-edited'],

    inject: {
        reloadUser: {
            from: 'profileEditReloadUser',
            default: () => () => {},
        },
    },

    setup() {
        const skillTexts = useSkillTexts()
        const toaster = useToasterStore()
        const { skillLevels, clampLevel } = useSkillLevels()
        return { skillTexts, toaster, skillLevels, clampLevel }
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
            lastAddedTalent: null,
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
            return [
                ...this.allSkills
                    .filter((s) => s.type === 'skill')
                    .sort(this.skillTexts.compareTitles),
            ]
        },
        hobbies() {
            return this.allSkills
                .filter((s) => s.type === 'hobby')
                .sort(this.skillTexts.compareTitles)
        },
    },

    methods: {
        onSkillAdded(newSkill) {
            this.lastAddedTalent = newSkill.id
            this.$emit('profile-edited')
        },
        async setTalentLevel(type, talent, newLevel) {
            if (this.clampLevel(talent.level) !== newLevel) {
                try {
                    await patchUserSkill(this.user.id, talent.id, {
                        ...talent,
                        level: newLevel,
                        tag: talent.tag.id,
                    })
                    this.toaster.pushSuccess(
                        this.$t(`profile.edit.skills.${type}.edit-success`, {
                            name: this.skillTexts.title(talent),
                        })
                    )
                    this.reloadUser()
                    this.$emit('profile-edited')
                } catch (error) {
                    console.error(error)
                    this.toaster.pushError(this.$t('profile.edit.skills.save-error'))
                }
            }
        },
        async removeTalent(type, talent) {
            try {
                await deleteUserSkill(this.user.id, talent.id)
                this.toaster.pushSuccess(
                    this.$t(`profile.edit.skills.${type}.delete-success`, {
                        name: this.skillTexts.title(talent),
                    })
                )
                this.reloadUser()
                this.$emit('profile-edited')
            } catch (error) {
                console.error(error)
                this.toaster.pushError(this.$t('profile.edit.skills.save-error'))
            }
        },

        openDrawer(type) {
            this.drawerType = type
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
    },
}
</script>
<style scoped lang="scss">
@import './profile-form';

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
    .actions {
        margin-top: $space-xl;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .add-action {
        margin-top: $space-xl;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .skill-list {
        margin-top: $space-xl;
        background-color: $primary-lighter;
        padding: $space-l pxToRem(17px);
        display: flex;
        flex-flow: column nowrap;
        gap: $space-m;
        border-radius: $border-radius-l;
    }
}

.talent-title {
    font-size: $font-size-l;
    font-weight: 700;
    color: $primary-dark;
    margin-top: $space-l;
    margin-bottom: $space-m;
    text-align: center;
}

.level-editor-list {
    margin-top: $space-xl;
    position: relative;
}
</style>
