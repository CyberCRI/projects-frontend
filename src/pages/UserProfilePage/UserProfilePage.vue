<script setup>
import UserProfile from '@/components/people/UserProfile.vue'
import { getUser } from '@/api/people.service.ts'
const props = defineProps({
    userId: {
        type: [String, Number],
        default: null,
    },
})
try {
    const user = await getUser(props.userId, true)
    if (user) {
        useLpiHead(
            useRequestURL().toString(),
            `${user.given_name} ${user.family_name}`,
            user.short_description,
            user.profile_picture?.variations?.medium
        )
    }
} catch (err) {
    // DGAF
    console.log(err)
}

const router = useRouter()
const route = useRoute()

function display404() {
    router.replace({
        name: 'page404',
        params: { pathMatch: route.path.substring(1).split('/') },
    })
}
</script>
<template>
    <div class="page-section-extra-wide profile-page">
        <UserProfile
            :key="userId"
            :user-id="userId"
            :show-page-link="false"
            @user-not-found="display404"
            routable-tabs
        />
    </div>
</template>

<style lang="scss" scoped>
.profile-page {
    padding-top: 6.5rem;
    padding-bottom: 6.5rem;
    display: flex;
    flex-flow: column nowrap;
    justify-content: stretch;
}
</style>
