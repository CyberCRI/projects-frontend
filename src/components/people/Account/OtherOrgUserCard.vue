<template>
    <div class="other-org-account-card">
        <CroppedApiImage
            :alt="
                user?.keycloack_id
                    ? `${user.given_name} ${user.family_name} image`
                    : `${user.name} image`
            "
            class="img-container"
            :picture-data="user.profile_picture"
            picture-size="small"
            default-picture="/placeholders/user_placeholder.svg"
        />
        <div class="text-wrapper">
            <h3 class="name">{{ user?.given_name }} {{ user?.family_name }}</h3>
            <h4 v-if="user?.job" class="job">{{ user.job }}</h4>
            <div class="loader" v-if="isLoadingOrgRoles">
                <LoaderSimple />
            </div>
            <ul v-else>
                <li
                    class="role-line"
                    :key="`${orgRole.role}:${orgRole.orgName}`"
                    v-for="orgRole in orgRoles"
                >
                    {{ orgRoleLabel(orgRole.role) }}
                    {{ $t('account.role-in-organization') }}
                    {{ orgRole.orgName }}
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
import CroppedApiImage from '@/components/base/media/CroppedApiImage.vue'
import LoaderSimple from '@/components/base/loader/LoaderSimple.vue'
import { getUser } from '@/api/people.service.ts'
import { getOrganizations } from '@/api/organizations.service.ts'

export default {
    name: 'OtherOrgUserCard',

    components: { CroppedApiImage, LoaderSimple },

    props: {
        user: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            isLoadingOrgRoles: false,
            orgRoles: [],
        }
    },

    mounted() {
        this.loadRoles()
    },

    methods: {
        async loadRoles() {
            this.isLoadingOrgRoles = true
            // TODO: getOrganizations might be paginated if more than 100, we'll need to handle the case some day
            await Promise.all([getUser(this.user.id), getOrganizations()]).then(([user, orgs]) => {
                const orgIndex = orgs.results.reduce((acc, org) => {
                    acc['#' + org.id] = org // the # is prefixed to org id in role code
                    return acc
                }, {})
                console.log(orgIndex)
                this.orgRoles =
                    user?.roles
                        .filter((role) => role.match(/^organization:[^:]+:[^:]+$/))
                        .map((role) => {
                            const roleParts = role.split(':')
                            return {
                                role: roleParts[2],
                                orgName:
                                    orgIndex[roleParts[1]]?.name ||
                                    this.$t('account.another-organization'),
                            }
                        }) || []
            })
            this.isLoadingOrgRoles = false
        },

        orgRoleLabel(role) {
            if (role == 'users') return this.$t('account.role.user')
            if (role == 'facilitators') return this.$t('account.role.facilitator')
            if (role == 'admins') return this.$t('account.role.admin')
        },
    },
}
</script>
<style lang="scss" scoped>
.other-org-account-card {
    display: flex;
    align-items: center;
    padding: $space-m;
    gap: $space-m;
    box-sizing: border-box;
    border-radius: $border-radius-m;
    background-color: $primary-lighter;
}

.img-container {
    border-radius: 50%;
    background-size: cover;
    background-position: top center;
    width: pxToRem(80px);
    height: pxToRem(80px);
    flex-shrink: 0;
}

.name {
    font-size: $font-size-m;
}

.job {
    font-weight: normal;
    font-size: $font-size-m;
}

.loader {
    display: flex;
    justify-content: center;
}
</style>
