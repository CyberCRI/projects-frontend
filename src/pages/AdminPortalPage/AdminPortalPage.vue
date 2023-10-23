<template>
    <div class="admin-portal-layout page-section-wide">
        <h1>{{ $t('admin.portal.management') }}</h1>
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
            return [
                {
                    key: 'admin-infos',
                    label: this.$t('admin.tabs.information'),
                    view: '/admin/general',
                },
                {
                    key: 'admin-categories',
                    label: this.$t('admin.tabs.categories'),
                    view: '/admin/categories',
                },
                {
                    key: 'admin-tags',
                    label: this.$t('admin.tabs.tags'),
                    view: '/admin/tags',
                },
                {
                    key: 'admin-help',
                    label: this.$t('admin.tabs.help'),
                    view: '/admin/faq',
                },
                {
                    key: 'admin-templates',
                    label: this.$t('admin.tabs.templates'),
                    view: '/admin/templates',
                },
                {
                    key: 'admin-roles',
                    label: this.$t('admin.tabs.users'),
                    view: '/admin/accounts',
                },
                {
                    key: 'admin-links',
                    label: this.$t('admin.tabs.links'),
                    view: '/admin/links',
                },
                {
                    key: 'admin-groups',
                    label: this.$t('admin.tabs.groups'),
                    view: '/admin/groups',
                },
            ]
        },
    },
}
</script>

<style lang="scss" scoped>
.admin-portal-layout {
    font-family: 'Archivo Narrow', 'Noto Sans SC', helvetica, arial, sans-serif;
    padding: 0 $space-xl;
    margin: auto;
    margin-bottom: $space-2xl;

    h1 {
        font-size: $font-size-7xl;
        font-weight: 700;
        text-align: center;
        margin-top: 98px;
        margin-bottom: $space-2xl;
    }
}
</style>
