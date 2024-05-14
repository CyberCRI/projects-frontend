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
            <section class="section" v-if="user.skills?.length">
                <UserSkills :full-list="true" :skills="user.skills" :title="$t('me.skills')" />
            </section>
            <section class="section" v-if="user.hobbies?.length">
                <UserSkills :full-list="true" :skills="user.hobbies" :title="$t('me.hobbies')" />
            </section>
        </template>
        <p v-else class="empty-field">{{ noSkillLabel }}</p>
    </div>
</template>

<script>
import UserSkills from '@/components/people/UserSkills/UserSkills.vue'
import SkillLevelTip from '@/components/people/SkillLevelTip.vue'
import LinkButton from '@/components/base/button/LinkButton.vue'

export default {
    name: 'ProfileSkillTab',

    components: {
        UserSkills,
        SkillLevelTip,
        LinkButton,
    },

    props: {
        user: {
            type: Object,
            required: true,
        },
    },

    computed: {
        allSkills() {
            return [...this.user.skills, ...this.user.hobbies]
        },

        isCurrentUser() {
            return this.$store.getters['users/id'] === this.user.id
        },

        noSkillLabel() {
            return this.isCurrentUser ? this.$t('me.no-skill') : this.$t('you.no-skill')
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
    color: $gray-8;
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
