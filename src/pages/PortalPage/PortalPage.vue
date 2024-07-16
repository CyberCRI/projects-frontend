<template>
    <div class="page-section-extra-wide portal-layout page-top">
        <h1 class="page-title">{{ $t('home.communities') }}</h1>
        <p class="sub-title">
            {{ $t('portal.sub-title') }}
        </p>

        <div class="org-card-ctn">
            <a
                v-for="organisation in organisations"
                :key="organisation.id"
                class="org-card shadow-box"
                :href="organisation.website_url"
                target="_blank"
                :style="{
                    backgroundColor: organisation.background_color,
                }"
                :title="organisation.name"
            >
                <div
                    class="portal-image"
                    :style="{
                        backgroundImage: `url(${organisation.logo_image.variations.medium})`,
                    }"
                ></div>
            </a>
        </div>
    </div>
</template>
<script>
export default {
    name: 'PortalPage',

    async mounted() {
        await this.$store.dispatch('organizations/getAllOrganizations')
    },

    computed: {
        organisations() {
            return this.$store.getters['organizations/all'].filter(
                (org) => org.is_logo_visible_on_parent_dashboard
            )
        },
    },
}
</script>
<style scoped lang="scss">
.portal-layout {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-bottom: $space-2xl;

    .org-card-ctn {
        display: flex;
        flex-flow: column wrap;
        gap: $space-2xl;
        margin-top: $space-xl;
        margin-bottom: $space-xl;

        .org-card {
            display: flex;
            flex-direction: column;
            justify-content: stretch;
            align-items: stretch;
            border-radius: $border-radius-m;
            border: $border-width-s solid $primary;
            overflow: hidden;
            padding: $space-m;
            height: pxToRem(96px);
            width: pxToRem(290px);

            .portal-image {
                flex-grow: 1;
                background-size: contain;
                background-repeat: no-repeat;
                background-position: center;
            }
        }
    }
}

@media (min-width: $min-tablet) {
    .portal-layout {
        .org-card-ctn {
            flex-direction: row;
            justify-content: center;
            margin-top: $space-3xl;
            margin-bottom: $space-3xl;

            .org-card {
                margin: unset;
            }
        }
    }
}
</style>
