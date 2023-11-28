<template>
    <ProfileEditBlock :block-title="$t('complete-profile.skills.title')">
        <ProfileSkillsEditTab v-if="user" :user="user" />
    </ProfileEditBlock>
</template>
<script>
import ProfileEditBlock from './ProfileEditBlock.vue'
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
        async save() {
            this.$emit('saving', true)
            await new Promise((resolve) => setTimeout(resolve, 1000))
            this.$emit('saving', false)
            return true
        },
    },
}
</script>
