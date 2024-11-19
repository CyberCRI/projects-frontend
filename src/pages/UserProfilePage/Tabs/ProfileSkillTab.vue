<template>
    <div class="skill-tab">
        <template v-if="allSkills.length">
            <div class="help">
                <SkillLevelTip>
                    <LinkButton
                        :label="$t(`me.levels-help-link`)"
                        btn-icon="HelpCircle"
                        data-test="skill-levels-help-button"
                    />
                </SkillLevelTip>
            </div>
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
import useLanguagesStore from '@/stores/useLanguages'

export default {
    name: 'ProfileSkillTab',

    components: {
        UserSkills,
        SkillLevelTip,
        LinkButton,
    },
    setup() {
        const usersStore = useUsersStore()
        const languagesStore = useLanguagesStore()
        return {
            usersStore,
            languagesStore,
        }
    },
    props: {
        user: {
            type: Object,
            required: true,
        },
    },

    computed: {
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
            return this.tagLabel(skill.tag)
        },

        tagLabel(tag) {
            return tag[`title_${this.languagesStore.current}`] || tag.title
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

@media screen and (max-width: $min-tablet) {
    .skill-tab {
        padding: $space-l $space-s;
    }
}
</style>
