<template>
    <div class="skill-summary">
        <div class="skill-header">
            <h4 class="title">{{ $t('profile.skills') }} ({{ allSkills.length }})</h4>
            <LpiButton
                v-if="allSkills.length > maxSkills"
                :label="$filters.capitalize($t('common.see-more'))"
                :secondary="true"
                right-icon="ArrowRight"
                size="link"
                @click="goToSkillTab"
                data-test="see-more-skills"
            />
        </div>

        <div class="skills">
            <template v-if="allSkills.length">
                <SkillItem
                    v-for="skill in visibleSkills"
                    :key="skill.id"
                    :label="skill.wikipedia_tag.name"
                    :level="Number(skill.level)"
                />
            </template>
            <p v-else class="empty-field">{{ noSkillLabel }}</p>
        </div>
    </div>
</template>

<script>
import SkillItem from '@/components/lpikit/SkillItem/SkillItem.vue'
import LpiButton from '@/components/lpikit/LpiButton/LpiButton.vue'

export default {
    name: 'SkillSummary',

    components: {
        LpiButton,
        SkillItem,
    },
    inject: {
        selectTab: {
            from: 'tabsLayoutSelectTab',
            default: () => {},
        },
    },
    props: {
        user: {
            type: Object,
            default: () => {},
        },
    },

    data() {
        return {
            maxSkills: 9,
        }
    },

    computed: {
        allStepsVisible() {
            return this.allSkills.length <= this.maxSkills
        },

        allSkills() {
            return [...this.user.skills, ...this.user.hobbies]
        },

        visibleSkills() {
            return this.allStepsVisible ? this.allSkills : this.allSkills.slice(0, this.maxSkills)
        },

        isCurrentUser() {
            return this.$store.getters['users/kid'] === this.user.keycloak_id
        },

        noSkillLabel() {
            return this.isCurrentUser ? this.$t('me.no-skill') : this.$t('you.no-skill')
        },
    },

    methods: {
        goToSkillTab() {
            this.selectTab(4)
        },
    },
}
</script>

<style lang="scss" scoped>
.skill-summary {
    display: flex;
    flex-direction: column;
    background: $green-lighter;
    padding: 24px;
    border-radius: $border-radius-l;

    .skill-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: $space-l;
    }

    .title {
        font-size: $font-size-l;
        font-weight: 700;
        color: $primary-dark;
    }

    .skills {
        display: flex;
        flex-direction: column;
    }
}

.empty-field {
    color: $gray-8;
    font-weight: 700;
}
</style>
