<script setup>
import useOnboardingStatus from '@/composables/useOnboardingStatus.ts'
import useSearch from '@/composables/useSearch.js'
import GlobalSearchTab from '@/pages/SearchPage/Tabs/GlobalSearchTab.vue'
import { getOrganizationByCode } from '@/api/organizations.service'

const { searchFromQuery } = useSearch(null)

const { onboardingTrap } = useOnboardingStatus()
const { t } = useI18n()

onMounted(async () => {
    onboardingTrap('explore_projects', false)
})
try {
    const runtimeConfig = useRuntimeConfig()
    const organization = await getOrganizationByCode(runtimeConfig.public.appApiOrgCode)

    useLpiHead(
        useRequestURL().toString(),
        t('browse.page-title'),
        organization?.dashboard_subtitle,
        organization?.banner_image?.variations?.medium
    )
} catch (err) {
    // DGAF
    console.log(err)
}
</script>

<template>
    <div class="page-section-extra-wide browse-layout" :key="$route.name">
        <div class="browse-header">
            <SearchOptions :limit="30" show-section-filter />
        </div>

        <GlobalSearchTab :search="searchFromQuery" />
    </div>
</template>

<style lang="scss" scoped>
.browse-layout {
    padding-top: pxToRem(74px);

    .tab {
        margin-top: $space-l;
    }
}

.browse-header {
    display: block;
    background-color: $primary-lighter;
    padding: $space-xl 0;
    padding: 1rem;
}

.project-list__header {
    display: flex;
    flex-direction: column;
    margin-bottom: $space-l;

    .header__title {
        grid-column: 2 / 3;
        place-self: center center;
        font-size: $font-size-3xl;
        font-weight: 700;
        margin: $space-m 0 $space-m 0;
        text-transform: uppercase;
        color: $almost-black;
    }
}

@media only screen and (width >= 1000px) {
    .project-list__header {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        margin-bottom: 0;
    }

    .header__title {
        margin: 0;
    }
}
</style>
