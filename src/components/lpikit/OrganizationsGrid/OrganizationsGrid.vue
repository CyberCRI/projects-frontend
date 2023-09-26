<template>
    <div class="organizations-ctn" :dir="dir">
        <div
            v-for="org in displayedOrgs"
            :key="org.id"
            class="organization"
            :style="{ background: org.background_color || '#fff' }"
        >
            <img :src="org.logo_image.url" />
        </div>

        <ToolTip
            v-if="project.organizations.length > 6"
            :content="additionalOrganizationsNames"
            placement="bottom"
            :secondary="true"
        >
            <div class="additional-orgs" dir="ltr">+ {{ project.organizations.length - 5 }}</div>
        </ToolTip>
    </div>
</template>

<script>
import ToolTip from '@/components/lpikit/ToolTip/ToolTip.vue'

export default {
    name: 'OrganizationsGrid',

    components: { ToolTip },

    props: {
        project: {
            type: Object,
            required: true,
        },

        dir: {
            type: String,
            default: 'rtl',
        },
    },

    computed: {
        additionalOrganizationsNames() {
            return this.project.organizations.length > 6
                ? this.project.organizations
                      .slice(5)
                      .map((org) => org.name)
                      .join(', ')
                : ''
        },

        displayedOrgs() {
            return this.project.organizations.length > 6
                ? this.project.organizations.slice(0, 5)
                : this.project.organizations
        },
    },
}
</script>

<style lang="scss" scoped>
.organizations-ctn {
    $item-width: pxToRem(62px);
    $item-height: pxToRem(42px);
    $item-gap: pxToRem(3px);

    width: 3 * $item-width + 2 * $item-gap;
    display: flex;
    flex-flow: row wrap;
    gap: $item-gap;
    align-content: flex-end;

    .organization {
        border-radius: $border-radius-s;
        overflow: hidden;
        width: $item-width;
        height: $item-height;
        display: flex;
        justify-content: center;
        align-items: center;

        img {
            object-fit: contain;
            height: 100%;
            width: 100%;
        }
    }

    .additional-orgs {
        border-radius: $border-radius-s;
        background: $primary;
        color: $white;
        font-weight: 700;
        width: $item-width;
        height: $item-height;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
    }
}
</style>
