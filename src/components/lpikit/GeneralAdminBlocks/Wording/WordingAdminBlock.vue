<template>
    <AdminBlock :block-title="$t('admin.portal.general.wording.title')" :is-loading="false">
        <template #actions>
            <LinkButton
                btn-icon="Plus"
                :label="$t('common.add')"
                @click="drawerIsOpen = true"
            ></LinkButton>
        </template>
        <template #default>
            <p class="notice">{{ $t('admin.portal.general.wording.notice') }}</p>

            <div class="sub-container">
                <h5 class="sub-title">{{ $t('admin.portal.general.wording.fields.title') }}</h5>
                <p class="sub-field">
                    {{ $t('admin.portal.general.wording.fields.title-placeholder') }}
                </p>
            </div>
            <div class="sub-container">
                <h5 class="sub-title">
                    {{ $t('admin.portal.general.wording.fields.description') }}
                </h5>
                <p class="sub-field">
                    {{ $t('admin.portal.general.wording.fields.description-placeholder') }}
                </p>
            </div>
        </template>
    </AdminBlock>
    <OrgWordingDrawer :is-opened="drawerIsOpen" @close="drawerIsOpen = false" />
</template>
<script>
import AdminBlock from '../AdminBlock.vue'
import LinkButton from '@/components/lpikit/LpiButton/LinkButton.vue'
import OrgWordingDrawer from '@/components/lpikit/GeneralAdminBlocks/Wording/OrgWordingDrawer.vue'

export default {
    name: 'WordingAdminBlock',

    components: {
        AdminBlock,
        LinkButton,
        OrgWordingDrawer,
    },

    data() {
        return {
            drawerIsOpen: false,
        }
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
        border-bottom: $border-width-s solid $gray-10;
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
