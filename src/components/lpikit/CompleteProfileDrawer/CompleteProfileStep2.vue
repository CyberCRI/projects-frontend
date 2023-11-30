<template>
    <div class="loader" v-if="loading">
        <LoaderSimple />
    </div>
    <template v-else>
        <ProfileEditBlock :block-title="$t('complete-profile.skills.title')">
            <ProfileSkillsEditTab v-if="user" :user="user" @edited="loadUser" />
        </ProfileEditBlock>
    </template>
</template>
<script>
import ProfileEditBlock from '@/components/lpikit/CompleteProfileDrawer/ProfileEditBlock.vue'
import ProfileSkillsEditTab from '@/pages/ProfileEditPage/Tabs/ProfileSkillsEditTab.vue'
import { getUser } from '@/api/people.service.ts'
import LoaderSimple from '@/components/lpikit/Loader/LoaderSimple.vue'

export default {
    name: 'CompleteProfileStep2',

    emits: ['saving', 'loading'],

    components: { ProfileSkillsEditTab, ProfileEditBlock, LoaderSimple },

    data() {
        return { user: null, loading: false }
    },

    async mounted() {
        this.loading = true
        this.$emit('loading', true)
        try {
            await this.loadUser()
        } catch (error) {
            console.error(error)
        } finally {
            this.loading = false
            this.$emit('loading', false)
        }
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
<style lang="scss" scoped>
.loader {
    flex-grow: 1;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
