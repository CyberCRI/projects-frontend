<template>
    <div class="skill-tab">
        <div class="header">
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
import LinkButton from '@/components/base/button/LinkButton.vue'
import useUsersStore from '@/stores/useUsers.ts'
import useSkillTexts from '@/composables/useSkillTexts.js'
import permissions from '@/mixins/permissions.ts'

export default {
    name: 'ProfileSkillTab',

    mixins: [permissions],

    components: {
        UserSkills,
        LinkButton,
    },
    setup() {
        const usersStore = useUsersStore()
        const skillTexts = useSkillTexts()
        return {
            usersStore,
            skillTexts,
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
                .sort(this.skillTexts.compareTitles)
        },

        hobbies() {
            return this.allSkills
                .filter((s) => s.type == 'hobby')
                .sort(this.skillTexts.compareTitles)
        },

        isCurrentUser() {
            return this.usersStore.id === this.user.id
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
    color: $mid-gray;
    font-weight: 700;
}

.section + .section {
    margin-top: $space-xl;
}

.header {
    display: flex;
    justify-content: flex-end;
    align-items: center;
}

@media screen and (max-width: $min-tablet) {
    .skill-tab {
        padding: $space-l $space-s;
    }
}
</style>
