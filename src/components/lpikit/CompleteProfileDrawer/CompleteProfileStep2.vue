<template>
    <ProfileEditBlock :block-title="$t('complete-profile.skills.title')">
        <ProfileSkillsEditTab v-if="user" :user="user" @edited="loadUser" />
    </ProfileEditBlock>
</template>
<script>
import ProfileEditBlock from '@/components/lpikit/CompleteProfileDrawer/ProfileEditBlock.vue'
import ProfileSkillsEditTab from '@/pages/ProfileEditPage/Tabs/ProfileSkillsEditTab.vue'
import { getUser } from '@/api/people.service.ts'

export default {
    name: 'CompleteProfileStep2',

    emits: ['saving'],

    components: { ProfileSkillsEditTab, ProfileEditBlock },

    data() {
        return { user: null }
    },

    async mounted() {
        await this.loadUser()
    },

    methods: {
        async loadUser() {
            try {
                this.user = await getUser(this.$store.getters['users/kid'])
            } catch (error) {
                console.error(error)
            }
        },
        /* eslint-disable-next-line vue/no-unused-properties */
        async save() {
            // this called by CompleteProfileDrawer.vue
            return true
        },
    },
}
</script>
