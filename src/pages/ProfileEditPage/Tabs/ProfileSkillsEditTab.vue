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
                    <div class="actions">
                        <LinkButton
                            :label="
                                $filters.capitalize($t(`profile.edit.skills.${key}.edit-items`))
                            "
                            btn-icon="Pen"
                            @click="openDrawer(key, 'add')"
                            :data-test="`edit-${key}-button`"
                        />
                        <LinkButton
                            :label="
                                $filters.capitalize($t(`profile.edit.skills.${key}.edit-levels`))
                            "
                            btn-icon="Pen"
                            @click="openDrawer(key, 'edit')"
                            data-test="edit-levels-button"
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
                    <div class="skill-list">
                        <SkillItem
                            v-for="skill in getSkillOfType(key)"
                            :key="`${skill.id}-${skill.level}`"
                            :label="skillLabel(skill)"
                            :level="Number(skill.level)"
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
        @close="closeDrawer"
        @switch-mode="drawerMode = $event"
        @skills-updated="$emit('profile-edited')"
    />
</template>
<script>
import LpiButton from '@/components/base/button/LpiButton.vue'
import LinkButton from '@/components/base/button/LinkButton.vue'
import SkillItem from '@/components/people/skill/SkillItem.vue'
import SkillsEditDrawer from '@/components/people/skill/SkillsEditDrawer.vue'
import SkillLevelTip from '@/components/people/skill/SkillLevelTip.vue'
import useLanguagesStore from '@/stores/useLanguages'
export default {
    name: 'ProfileSkillsEditTab',
    components: {
        LpiButton,
        SkillItem,
        SkillsEditDrawer,
        SkillLevelTip,
        LinkButton,
    },

    emits: ['edited', 'profile-edited'],

    setup() {
        const languagesStore = useLanguagesStore()
        return { languagesStore }
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
            return this.allSkills.filter((s) => s.type === 'skill')
        },
        hobbies() {
            return this.allSkills.filter((s) => s.type === 'hobby')
        },
    },

    methods: {
        openDrawer(type, mode) {
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
</style>
