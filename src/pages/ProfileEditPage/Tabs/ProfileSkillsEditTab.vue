<template>
    <div class="profile-edit-skills">
        <div class="initial-screen" v-if="isInitial">
            <p class="intro">
                {{ $t('profile.edit.skills.intro') }}
            </p>
            <div class="actions">
                <LpiButton
                    :label="$filters.capitalize($t('profile.edit.skills.skills.add'))"
                    left-icon="Plus"
                    :secondary="false"
                    @click="openDrawer('skills', 'add')"
                    data-test="add-skills-button"
                />
                <LpiButton
                    :label="$filters.capitalize($t('profile.edit.skills.hobbies.add'))"
                    left-icon="Plus"
                    :secondary="false"
                    @click="openDrawer('hobbies', 'add')"
                    data-test="add-hobbies-button"
                />
            </div>
        </div>
        <div class="following-screen" v-else>
            <div v-for="key in ['skills', 'hobbies']" :key="key" :class="key">
                <template v-if="user[key] && user[key].length">
                    <div class="actions">
                        <LpiButton
                            :label="
                                $filters.capitalize($t(`profile.edit.skills.${key}.edit-items`))
                            "
                            left-icon="Pen"
                            :secondary="true"
                            :no-margin="true"
                            :no-border="true"
                            @click="openDrawer(key, 'add')"
                            data-test="edit-skills-button"
                        />
                        <LpiButton
                            :label="
                                $filters.capitalize($t(`profile.edit.skills.${key}.edit-levels`))
                            "
                            left-icon="Pen"
                            :secondary="true"
                            :no-margin="true"
                            :no-border="true"
                            @click="openDrawer(key, 'edit')"
                            data-test="edit-levels-button"
                        />

                        <SkillLevelTip>
                            <LpiButton
                                :label="
                                    $filters.capitalize(
                                        $t(`profile.edit.skills.${key}.levels-help`)
                                    )
                                "
                                left-icon="HelpCircle"
                                :secondary="true"
                                :no-margin="true"
                                :no-border="true"
                                data-test="skill-levels-help-button"
                            />
                        </SkillLevelTip>
                    </div>
                    <div class="skill-list">
                        <SkillItem
                            v-for="skill in user[key]"
                            :key="skill.id"
                            :label="skill.wikipedia_tag.name"
                            :level="Number(skill.level)"
                        />
                    </div>
                </template>
                <div v-else class="add-action">
                    <LpiButton
                        :label="$filters.capitalize($t(`profile.edit.skills.${key}.add`))"
                        left-icon="Plus"
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
    />
</template>
<script>
import LpiButton from '@/components/lpikit/LpiButton/LpiButton.vue'
import SkillItem from '@/components/lpikit/SkillItem/SkillItem.vue'
import SkillsEditDrawer from '@/components/lpikit/SkillsEditDrawer/SkillsEditDrawer.vue'
import SkillLevelTip from '@/components/Profile/SkillLevelTip.vue'
export default {
    name: 'ProfileSkillsEditTab',
    components: {
        LpiButton,
        SkillItem,
        SkillsEditDrawer,
        SkillLevelTip,
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
                ((!this.user.skills || this.user.skills.length === 0) &&
                    (!this.user.hobbies || this.user.hobbies.length === 0))
            )
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
        line-height: 1.5;
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
        border-radius: $border-radius-20;
    }
}
</style>