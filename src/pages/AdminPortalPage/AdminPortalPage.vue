<template>
    <div class="admin-portal-layout page-section-extra-wide page-top">
        <h1 class="page-title">{{ $t('admin.portal.management') }}</h1>
        <TabsLayout :tabs="tabs" :border="false" align-left router-view />
    </div>
</template>

<script>
import TabsLayout from '@/components/lpikit/Tabs/TabsLayout.vue'

export default {
    name: 'AdminPortalPage',

    components: {
        TabsLayout,
    },

    computed: {
        tabs() {
            const requestAdminTab = this.$store.getters['organizations/current']
                ?.access_request_enabled
                ? [
                      {
                          key: 'admin-requests',
                          label: this.$t('admin.tabs.requests'),
                          view: { name: 'RequestsAdminTab' },
                      },
                  ]
                : []

            return [
                {
                    key: 'admin-infos',
                    label: this.$t('admin.tabs.information'),
                    view: { name: 'general' },
                },
                {
                    key: 'admin-categories',
                    label: this.$t('admin.tabs.categories'),
                    view: { name: 'categories' },
                },
                {
                    key: 'admin-tags',
                    label: this.$t('admin.tabs.tags'),
                    view: { name: 'tags' },
                },
                {
                    key: 'admin-help',
                    label: this.$t('admin.tabs.help'),
                    view: { name: 'faq' },
                },
                {
                    key: 'admin-templates',
                    label: this.$t('admin.tabs.templates'),
                    view: { name: 'templates' },
                },
                {
                    key: 'admin-roles',
                    label: this.$t('admin.tabs.users'),
                    view: { name: 'Accounts' },
                },
                {
                    key: 'admin-links',
                    label: this.$t('admin.tabs.links'),
                    view: { name: 'links' },
                },
                ...requestAdminTab,
                {
                    key: 'admin-groups',
                    label: this.$t('admin.tabs.groups'),
                    view: { name: 'groups' },
                },
            ]
        },
    },
}
</script>

<style lang="scss" scoped>
.admin-portal-layout {
    margin-bottom: $space-2xl;

    .page-title {
        margin-bottom: $space-xl;
    }
}
</style>
