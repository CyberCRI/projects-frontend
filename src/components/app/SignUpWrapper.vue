<template>
    <div class="sign-up-wrapper">
        <div class="logos-ctn left">
            <div class="organization-logo" :style="orgLogoStyle"></div>
            <hr class="separator" />
            <div class="projects-logo-ctn">
                <ProjectLogo class="directory-logo" />
            </div>
        </div>
        <div class="right">
            <div class="box-ctn">
                <h1 class="title" data-test="register-confirm">
                    {{ signUpTitle }}
                </h1>
                <slot name="pre-box"></slot>
                <div class="box form">
                    <slot></slot>
                </div>
            </div>
            <slot name="post-box"></slot>
        </div>
    </div>
</template>
<script>
import ProjectLogo from '@/components/base/media/ProjectLogo.vue'
import useOrganizationsStore from '@/stores/useOrganizations.ts'
export default {
    name: 'SignUpWrapper',

    components: {
        ProjectLogo,
    },

    setup() {
        const organizationsStore = useOrganizationsStore()
        return {
            organizationsStore,
        }
    },
    props: {
        signUpTitle: {
            type: String,
            default: '',
        },
    },

    computed: {
        organizationLogo() {
            return this.organizationsStore.current?.logo_image?.variations?.medium
        },
        orgLogoStyle() {
            return { 'background-image': `url(${this.organizationLogo})` }
        },
    },
}
</script>

<style lang="scss" scoped>
$form-max-width: pxToRem(326px);
$form-horizontal-padding: pxToRem(62px);
$column-gap: $space-2xl;
$container-horizontal-padding: $space-xl;
$form-max-total-width: $form-max-width + 2 * $form-horizontal-padding;

/* stylelint-disable-next-line  scss/operator-no-newline-after */
$min-width-horizontal-layout: 2 * $form-max-total-width + $column-gap + 2 *
    $container-horizontal-padding;

.title {
    font-size: $font-size-2xl;
    margin-bottom: $space-l;
    text-align: center;
}

.sign-up-wrapper {
    display: flex;
    gap: $column-gap;
    margin: $navbar-height auto;
    flex-flow: column nowrap;
    padding: $space-xl $space-l;

    @media all and (min-width: $min-width-horizontal-layout) {
        padding: $space-xl $container-horizontal-padding;
        width: 100%;
        max-width: $min-width-horizontal-layout;
        flex-flow: row nowrap;
        box-sizing: border-box;
    }
}

.right,
.left,
.box-ctn {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
}

@media all and (min-width: $min-width-horizontal-layout) {
    .left,
    .right {
        flex: 0 0 50%;
        max-width: $form-max-total-width;
    }
}

.box {
    width: 100%;
    padding: pxToRem(40px) 0;
    box-sizing: border-box;

    @media all and (min-width: $min-width-horizontal-layout) {
        max-width: $form-max-total-width;
        padding: pxToRem(40px) $form-horizontal-padding;
        box-shadow: 0 0 6px 0 #00000026;
        border-radius: $border-radius-m;
    }
}

:deep(.confirm-message) {
    font-size: $font-size-m;

    @media all and (max-width: $min-width-horizontal-layout) {
        max-width: 30rem;
    }
}

.separator {
    margin: $space-l auto;
    width: 50%;
    padding: 0;
    border: $border-width-s solid $lighter-gray;
}

.projects-logo-ctn,
.organization-logo {
    width: 100%;
    height: 15rem;
}

.projects-logo-ctn {
    display: flex;
    align-items: flex-start;
    justify-content: center;

    @media all and (max-width: $min-width-horizontal-layout) {
        height: auto;
    }
}

.organization-logo {
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center bottom;
}

.directory-logo {
    width: pxToRem(200px);
    height: auto;
}
</style>
