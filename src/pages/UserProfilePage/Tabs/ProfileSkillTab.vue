<template>
    <div class="skill-tab">
        <div class="header">
            <SkillLevelTip>
                <LinkButton
                    :label="$t(`me.levels-help-link`)"
                    btn-icon="HelpCircle"
                    data-test="skill-levels-help-button"
                />
            </SkillLevelTip>
            <LinkButton
                v-if="isCurrentUser || canEditUser"
                class="edit-btn"
                btn-icon="Pen"
                :label="$t('common.edit')"
                :to="editProfileSkillLink"
                data-test="edit-skills"
            />
        </div>
        <template v-if="allSkills.length">
            <section class="section" v-if="skills?.length">
                <UserSkills :full-list="true" :skills="skills" :title="$t('me.skills')" />
            </section>
            <section class="section" v-if="hobbies?.length">
                <UserSkills :full-list="true" :skills="hobbies" :title="$t('me.hobbies')" />
            </section>
        </template>
        <p v-else class="empty-field">{{ noSkillLabel }}</p>
    </div>
</template>

<script>
import UserSkills from '@/components/people/skill/UserSkills.vue'
import SkillLevelTip from '@/components/people/skill/SkillLevelTip.vue'
import LinkButton from '@/components/base/button/LinkButton.vue'
import useUsersStore from '@/stores/useUsers.ts'
import useTagTexts from '@/composables/useTagTexts.js'
import permissions from '@/mixins/permissions.ts'

export default {
    name: 'ProfileSkillTab',

    mixins: [permissions],

    components: {
        UserSkills,
        SkillLevelTip,
        LinkButton,
    },
    setup() {
        const usersStore = useUsersStore()
        const tagTexts = useTagTexts()
        return {
            usersStore,
            tagTexts,
        }
    },
    props: {
        user: {
            type: Object,
            required: true,
        },
    },

    computed: {
        editProfileSkillLink() {
            return {
                name: 'ProfileEditSkills' + (this.isCurrentUser ? '' : 'Other'),
                params: this.isCurrentUser ? {} : { userId: this.user.id },
            }
        },

        allSkills() {
            return this.user.skills || []
        },

        skills() {
            return this.allSkills
                .filter((s) => s.type == 'skill')
                .sort((a, b) => this.skillLabel(a).localeCompare(this.skillLabel(b)))
        },

        hobbies() {
            return this.allSkills
                .filter((s) => s.type == 'hobby')
                .sort((a, b) => this.skillLabel(a).localeCompare(this.skillLabel(b)))
        },

        isCurrentUser() {
            return this.usersStore.id === this.user.id
        },

        noSkillLabel() {
            return this.isCurrentUser ? this.$t('me.no-skill') : this.$t('you.no-skill')
        },
    },
    methods: {
        skillLabel(skill) {
            return this.tagTexts.title(skill.tag)
        },
    },
}
</script>

<style lang="scss" scoped>
.skill-tab {
    padding: 24px 0;
}

.title {
    font-size: $font-size-m;
    font-weight: 700;
    color: $primary-dark;
}

.empty-field {
    padding-top: $space-l;
    color: $mid-gray;
    font-weight: 700;
}

.section + .section {
    margin-top: $space-xl;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

@media screen and (max-width: $min-tablet) {
    .skill-tab {
        padding: $space-l $space-s;
    }
}
</style>
