<template>
    <div id="projects-map">
        <Transition name="fade">
            <div v-if="loading" class="map-loader">
                <LoaderComplex :label="$t('location.loading')" />
            </div>
        </Transition>
        <LazyGeneralMap v-if="isClient" :locations="projectLocations" :loading="loading" />
        <div v-if="!loading && !projectLocations.length" class="empty-map">
            {{ $t('map.empty') }}
        </div>
    </div>
</template>

<script>
import imageMixin from '@/mixins/imageMixin.ts'
import LoaderComplex from '@/components/base/loader/LoaderComplex.vue'
import { getLocations } from '@/api/locations.services'
import useOrganizationsStore from '@/stores/useOrganizations.ts'
import { LazyGeneralMap } from '#components'

export default {
    name: 'MapPage',

    mixins: [imageMixin],

    components: {
        LoaderComplex,
        LazyGeneralMap,
    },
    setup() {
        const isClient = import.meta.client
        const organizationsStore = useOrganizationsStore()
        return {
            organizationsStore,
            isClient,
        }
    },
    // pageTitle() {
    //     return this.$t('map.page-title')
    // },

    data() {
        return {
            projectLocations: [],
            loading: true,
        }
    },

    beforeUnmount() {
        document.getElementsByTagName('body')[0].classList.remove('map-no-scroll')
        document.title = 'Projects'
    },

    async mounted() {
        document.getElementsByTagName('body')[0].classList.add('map-no-scroll')
        await this.getLocations()
    },

    methods: {
        async getLocations(page = null) {
            this.loading = true
            const locations = await getLocations(
                { organizations: [this.organizationsStore.current.code] },
                page
            )
            this.projectLocations.push(...locations)
            // if (
            //     locations.total_page > 1 &&
            //     !!locations.next_page &&
            //     locations.current_page < locations.total_page // weird backend bug: if no location we still get a next page
            // ) {
            //     await this.getLocations(locations.next)
            // } else
            // if (this.$refs && this.$refs.map) this.$refs.map.centerMap()
            /*
             ** The previous line checks if the refs are still set, in case the user leaves the page to fast
             ** Not checking this might create an error after the API calls are done.
             */
            this.loading = false
        },
    },
}
</script>

<style lang="scss">
// do NOT scope this style, it will break the map
@import '@/design/scss/map';
</style>

<style lang="scss" scoped>
#projects-map {
    height: calc(100vh - $navbar-height);
    margin-top: $navbar-height;
    position: relative;
    touch-action: none;

    .leaflet-map,
    .leaflet-container {
        height: 100%;
    }

    .map-loader {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: $zindex-fixed;

        svg {
            margin: 0 auto $space-m;
        }
    }

    .leaflet-top {
        // override leaflet value
        margin-top: pxToRem(40px);
    }

    .empty-map {
        display: inline-block;
        background-color: $primary-light;
        border-radius: $border-radius-l;
        padding: $space-l;
        font-size: $font-size-xl;
        text-align: center;
        position: absolute;
        top: 50%;
        left: 50%;
        z-index: 100000; // yes map is high....
        transform: translate(-50%, -50%);
        max-width: 90vw;
    }

    .icon {
        width: pxToRem(18px);
        height: pxToRem(18px);

        &--close {
            background: $primary-dark;
            fill: $white;
            border-radius: 50%;
        }
    }
}

body.map-no-scroll {
    overflow: hidden;
}
</style>
