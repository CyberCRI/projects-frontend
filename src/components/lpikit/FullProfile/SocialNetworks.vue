<template>
    <div class="social-networks">
        <a v-if="user.facebook" :href="user.facebook" target="_blank">
            <IconImage name="Facebook" />
        </a>

        <a v-if="user.twitter" :href="user.twitter" target="_blank">
            <IconImage name="Twitter" />
        </a>

        <a v-if="user.linkedin" :href="user.linkedin" target="_blank">
            <IconImage name="Linkedin" />
        </a>

        <a v-if="user.skype" :href="user.skype" target="_blank">
            <IconImage name="Skype" />
        </a>
    </div>
</template>

<script>
import IconImage from '@/components/svgs/IconImage.vue'

export default {
    name: 'SocialNetworks',

    components: { IconImage },

    props: {
        user: {
            type: Object,
            default: () => {},
        },
    },
}
</script>

<style lang="scss" scoped>
.social-networks {
    display: flex;
    align-items: center;
    gap: $space-m;
    margin-top: $space-m;

    &:empty {
        display: none;
    }

    a {
        background: $primary-dark;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        width: pxToRem(22px);
        height: pxToRem(22px);
    }

    svg {
        width: pxToRem(18px);
        height: pxToRem(18px);
        cursor: pointer;
        fill: $white;
    }
}
</style>
