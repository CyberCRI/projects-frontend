<template>
    <ToolTip :hover="true" :interactive="true" :secondary="true" :is-text-content="false">
        <template #custom-content>
            <p class="tos-tooltip-content">
                The English version of the {{ itemTitle }} is coming soon. If you need the English
                version, contact us at
                <a href="mailto:projects@learningplanetinstitute.org">
                    projects@learningplanetinstitute.org
                </a>
            </p>
        </template>
        <slot />
    </ToolTip>
</template>
<script>
import ToolTip from '@/components/lpikit/ToolTip/ToolTip.vue'
export default {
    name: 'FooterEnglishTips',

    components: {
        ToolTip,
    },
    props: {
        itemTitle: {
            type: String,
            default: 'page',
        },
    },
}
</script>
<style lang="scss" scoped>
.tos-tooltip-content {
    max-width: 20rem;
    padding: 1rem;
    line-height: 1.4;

    a {
        color: $white;
        text-decoration: underline;
    }
}
</style>
