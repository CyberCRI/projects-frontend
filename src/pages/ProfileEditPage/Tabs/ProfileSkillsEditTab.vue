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
            <div v-for="key in ['skills', 'hobbies']" :key="key" :class="key">
                <template v-if="getSkillOfType(key).length">
                    <h3 class="talent-title">{{ $t(`profile.edit.skills.${key}.selection`) }}</h3>
                    <div class="actions">
                        <LinkButton
                            :label="$filters.capitalize($t(`profile.edit.skills.${key}.add-item`))"
                            btn-icon="Plus"
                            @click="openDrawer(key)"
                            :data-test="`edit-${key}-button`"
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
                    <div class="level-editor-list">
                        <div
                            class="entry"
                            v-for="skill in getSkillOfType(key)"
                            :key="`${skill.id}-${skill.level}`"
                        >
                            <h4 class="skill-name">{{ skillLabel(skill) }}</h4>
                            <div class="level-editor">
                                <label
                                    class="level"
                                    v-for="level in skillLevels"
                                    @click="setTalentLevel(skill, level.value)"
                                    :key="level.value"
                                >
                                    <input
                                        type="radio"
                                        :checked="level.value == clampLevel(skill.level)"
                                    />
                                    <span class="level-name">{{ level.label }}</span>
                                </label>
                            </div>
                            <div class="delete-action">
                                <IconImage
                                    name="TrashCanOutline"
                                    class="delete-icon"
                                    @click="removeTalent(skill)"
                                />
                            </div>
                        </div>
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
        :type="drawerType"
        @close="closeDrawer"
        @switch-mode="drawerMode = $event"
        @skills-updated="$emit('profile-edited')"
    />
</template>
<script>
import LpiButton from '@/components/base/button/LpiButton.vue'
import LinkButton from '@/components/base/button/LinkButton.vue'
import SkillsEditDrawer from '@/components/people/skill/SkillsEditDrawer.vue'
import SkillLevelTip from '@/components/people/skill/SkillLevelTip.vue'
import useLanguagesStore from '@/stores/useLanguages'
import IconImage from '@/components/base/media/IconImage.vue'
import { patchUserSkill, deleteUserSkill } from '@/api/people.service.ts'
import useToasterStore from '@/stores/useToaster.ts'
export default {
    name: 'ProfileSkillsEditTab',
    components: {
        LpiButton,
        SkillsEditDrawer,
        SkillLevelTip,
        LinkButton,
        IconImage,
    },

    emits: ['edited', 'profile-edited'],

    inject: {
        reloadUser: {
            from: 'profileEditReloadUser',
            default: () => () => {},
        },
    },

    setup() {
        const languagesStore = useLanguagesStore()
        const toaster = useToasterStore()
        return { languagesStore, toaster }
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
            return this.allSkills
                .filter((s) => s.type === 'skill')
                .sort((a, b) => this.skillLabel(a).localeCompare(this.skillLabel(b)))
        },
        hobbies() {
            return this.allSkills
                .filter((s) => s.type === 'hobby')
                .sort((a, b) => this.skillLabel(a).localeCompare(this.skillLabel(b)))
        },
        skillLevels() {
            // CAUTION : this must be ordered from lowest to highest (see clampLevel())
            return [
                {
                    label: this.$t('profile.edit.skills.levels.curious'),
                    value: 1,
                },
                {
                    label: this.$t('profile.edit.skills.levels.basic'),
                    value: 2,
                },
                {
                    label: this.$t('profile.edit.skills.levels.competent'),
                    value: 3,
                },
                {
                    label: this.$t('profile.edit.skills.levels.expert'),
                    value: 4,
                },
            ]
        },
    },

    methods: {
        async setTalentLevel(talent, newLevel) {
            if (this.clampLevel(talent.level) !== newLevel) {
                try {
                    await patchUserSkill(this.user.id, talent.id, {
                        ...talent,
                        level: newLevel,
                        tag: talent.tag.id,
                    })
                    this.toaster.pushSuccess(this.$t('profile.edit.skills.save-success'))
                    this.reloadUser()
                    this.$emit('profile-edited')
                } catch (error) {
                    console.error(error)
                    this.toaster.pushError(this.$t('profile.edit.skills.save-error'))
                }
            }
        },
        async removeTalent(talent) {
            try {
                await deleteUserSkill(this.user.id, talent.id)
                this.toaster.pushSuccess(this.$t('profile.edit.skills.save-success'))
                this.reloadUser()
                this.$emit('profile-edited')
            } catch (error) {
                console.error(error)
                this.toaster.pushError(this.$t('profile.edit.skills.save-error'))
            }
        },
        clampLevel(level) {
            return Math.min(
                Math.max(level, this.skillLevels[0].value),
                this.skillLevels[this.skillLevels.length - 1].value
            )
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
        skillLabel(skill) {
            return this.tagLabel(skill.tag)
        },

        tagLabel(tag) {
            return tag[`title_${this.languagesStore.current}`] || tag.title
        },
    },
}
</script>
<style scoped lang="scss">
@import './profile-form';

.profile-edit-skills {
    width: pxToRem(600px);
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

    .entry {
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        gap: $space-unit;
        align-items: center;
        border-top: $border-width-s solid $lighter-gray;
        padding: $space-l 0;

        &:last-child {
            border-bottom: $border-width-s solid $lighter-gray;
        }

        .skill-name {
            font-weight: 700;
        }

        .level-editor {
            display: flex;
            flex-flow: row nowrap;
            justify-content: flex-end;
            align-items: center;
            gap: $space-m;
            flex-shrink: 0;
            flex-grow: 1;

            .level {
                display: flex;
                flex-flow: row nowrap;
                justify-content: flex-start;
                align-items: center;
                gap: $space-s;
                margin: 0;
                font-size: 1rem;

                input[type='radio'] {
                    appearance: none;
                    background-color: $white;
                    margin: 0;
                    font: inherit;
                    width: $font-size-l;
                    height: $font-size-l;
                    border: $border-width-s solid $primary-dark;
                    border-radius: 100%;
                    transform: translateY(-0.075em);
                    display: inline-block;
                    position: relative;
                    cursor: pointer;
                }

                input[type='radio']::before {
                    content: '';
                    display: inline-block;
                    width: $font-size-xs;
                    height: $font-size-xs;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%) scale(0);
                    transition: 120ms transform ease-in-out;
                    box-shadow: inset 1em 1em $primary-dark;
                    border-radius: 100%;
                }

                input[type='radio']:checked::before {
                    transform: translate(-50%, -50%) scale(1);
                }

                .level-name {
                    color: $primary-dark;
                    font-weight: 700;
                }
            }
        }

        .delete-action {
            padding: 0 $space-m;
            flex-shrink: 0;

            .delete-icon {
                width: $font-size-l;
                height: $font-size-l;
                fill: $primary-dark;
                display: inline-block;
                vertical-align: middle;
                cursor: pointer;
            }
        }
    }
}
</style>
