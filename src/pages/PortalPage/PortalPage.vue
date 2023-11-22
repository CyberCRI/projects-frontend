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
            >
                <div
                    v-if="organisation.logo_image"
                    class="org-image-container"
                    :style="{ backgroundColor: organisation.background_color }"
                >
                    <img
                        :alt="organisation.name"
                        :src="organisation.logo_image.variations.medium"
                        class="org-image"
                    />
                </div>

                <div class="org-content">
                    <h2 class="org-title">{{ organisation.name }}</h2>
                    <p v-if="organisation.description" class="org-description">
                        {{ organisation.description }}
                    </p>
                </div>
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
    $item-width: pxToRem(62px);
    $item-height: pxToRem(42px);
    $item-gap: pxToRem(3px);

    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin-bottom: $space-2xl;

    .sub-title {
        font-size: $font-size-m;
        font-style: normal;
        font-weight: 400;
        line-height: 24px;
    }

    .org-card-ctn {
        display: flex;
        flex-flow: column wrap;

        .org-card {
            display: flex;
            flex-direction: column;
            justify-content: center;
            border-radius: 12px;
            border: $border-width-s solid $green;
            overflow: hidden;
            margin: $space-l;
            width: pxToRem(290px);

            // put back pxToRem(250px); for height when content is displayed again (see .org-content)
            height: pxToRem(96px);

            .org-image-container {
                // re-enable when content is displayed again (see .org-content)
                // min-height: pxToRem(100px);
                width: inherit;
                display: flex;
                align-items: center;
                justify-content: center;
                border-bottom: $border-width-s solid $green;

                .org-image {
                    width: auto;
                    height: auto;
                    max-width: 100%;
                    max-height: 100%;
                }
            }

            .org-content {
                padding: pxToRem(20px);
                height: 100%;
                display: none; // hide for now as data is too poor yet

                .org-title {
                    font-size: $font-size-2xl;
                    font-style: normal;
                    font-weight: 700;
                    line-height: 30px;
                }

                .org-description {
                    font-size: $font-size-m;
                    font-style: normal;
                    font-weight: 400;
                    line-height: 24px;
                }
            }
        }
    }
}

@media (min-width: $min-tablet) {
    .portal-layout {
        .org-card-ctn {
            flex-direction: row;
            justify-content: center;
            gap: 20px;
            margin-top: $space-3xl;
            margin-bottom: $space-3xl;

            .org-card {
                margin: unset;
            }
        }
    }
}
</style>
