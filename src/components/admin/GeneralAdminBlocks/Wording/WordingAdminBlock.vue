<template>
    <AdminBlock :block-title="$t('admin.portal.general.wording.title')" :is-loading="false">
        <template #actions>
            <LinkButton
                btn-icon="Pen"
                :label="$t('common.edit')"
                @click="drawerIsOpen = true"
            ></LinkButton>
        </template>
        <template #default>
            <p class="notice">{{ $t('admin.portal.general.wording.notice') }}</p>

            <div class="sub-container">
                <h5 class="sub-title">{{ $t('admin.portal.general.wording.fields.title') }}</h5>
                <p class="sub-field">
                    {{ title }}
                </p>
            </div>
            <div class="sub-container">
                <h5 class="sub-title">
                    {{ $t('admin.portal.general.wording.fields.description') }}
                </h5>
                <p class="sub-field">
                    {{ description }}
                </p>
            </div>
        </template>
    </AdminBlock>
    <OrgWordingDrawer
        :is-opened="drawerIsOpen"
        @close="drawerIsOpen = false"
        @organization-edited="reloadOrganization"
    />
</template>
<script>
import AdminBlock from '../AdminBlock.vue'
import LinkButton from '@/components/base/button/LinkButton.vue'
import OrgWordingDrawer from '@/components/admin/GeneralAdminBlocks/Wording/OrgWordingDrawer.vue'
import useOrganizationsStore from '@/stores/useOrganizations.ts'

export default {
    name: 'WordingAdminBlock',

    components: {
        AdminBlock,
        LinkButton,
        OrgWordingDrawer,
    },
    setup() {
        const organizationsStore = useOrganizationsStore()
        return {
            organizationsStore,
        }
    },
    data() {
        return {
            drawerIsOpen: false,
        }
    },

    computed: {
        organization() {
            return this.organizationsStore.current
        },
        title() {
            return (
                this.organization?.dashboard_title ||
                $t('admin.portal.general.wording.fields.title-placeholder')
            )
        },
        description() {
            if (this.organization?.description) {
                const sanitized = this.organization?.description.replace(/<[^>]+>/g, ' ')
                return sanitized.substring(0, 255) + (sanitized.length > 255 ? '...' : '')
            }
            return this.$t('admin.portal.general.wording.fields.description-placeholder')
        },
    },

    methods: {
        reloadOrganization() {
            this.organizationsStore.getCurrentOrganization(this.organization.code)
        },
    },
}
</script>
<style lang="scss" scoped>
.sub-container {
    position: relative;
    padding: $space-m 0;

    &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 6rem;
        height: 1px;
        border-bottom: $border-width-s solid $lighter-gray;
    }

    .sub-title,
    .sub-field {
        font-size: $font-size-m;
        color: $black;
        font-weight: normal;
        margin: $space-m 0;
    }
}
</style>
