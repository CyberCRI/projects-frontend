<template>
    <div class="admin-portal-layout narrow-body">
        <h1>{{ $t('admin.portal.management') }}</h1>
        <TabsLayout :tabs="tabs" :border="false" align-left router-view />
    </div>
</template>

<script>
import TabsLayout from '@/components/lpikit/Tabs/TabsLayout.vue'

export default {
    name: 'AdminPortalLayout',

    components: {
        TabsLayout,
    },

    mounted() {
        this.$store.dispatch('app/updateLoading', { visible: false })
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
    max-width: unset;
    font-family: 'Archivo Narrow', 'Noto Sans SC', helvetica, arial, sans-serif;
    padding: 0 $space-xl;
    margin: auto;
    margin-bottom: $space-2xl;

    h1 {
        font-size: $font-size-7xl;
        font-weight: 700;
        text-align: center;
        margin: 98px 0 $space-2xl;
    }

    @media (min-width: $min-tablet) {
        max-width: 1250px;
    }
}
</style>
