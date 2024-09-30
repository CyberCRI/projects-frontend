<template>
    <div id="projects-map">
        <Transition name="fade">
            <div v-if="loading" class="map-loader">
                <LoaderComplex :label="$t('location.loading')" />
            </div>
        </Transition>
        <div class="leaflet-map" :class="{ loading }">
            <BaseMap ref="map" :config="config" :use-cluster="true">
                <template #default="slotProps">
                    <MapPointer
                        v-for="location in projectLocations"
                        :key="location.id"
                        @mounted="slotProps.addPointer"
                        @unmounted="slotProps.removePointer(location)"
                        :location="location"
                        :has-project-tip="true"
                    />
                </template>
            </BaseMap>
        </div>
        <div v-if="!loading && !projectLocations.length" class="empty-map">
            {{ $t('map.empty') }}
        </div>
    </div>
</template>

<script>
import imageMixin from '@/mixins/imageMixin.ts'
import pageTitle from '@/mixins/pageTitle.ts'
import LoaderComplex from '@/components/base/loader/LoaderComplex.vue'
import BaseMap from '@/components/map/BaseMap.vue'
import MapPointer from '@/components/map/MapPointer.vue'
import { getLocations } from '@/api/locations.services'
import useOrganizationsStore from '@/stores/useOrganizations.ts'

export default {
    name: 'MapPage',

    mixins: [imageMixin, pageTitle],

    components: {
        LoaderComplex,
        MapPointer,
        BaseMap,
    },
    setup() {
        const organizationsStore = useOrganizationsStore()
        return {
            organizationsStore,
        }
    },
    pageTitle() {
        return this.$t('map.page-title')
    },

    data() {
        return {
            projectLocations: [],
            loading: true,
            config: {
                mapUrl: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
                zoom: 1,
                maxZoom: 17,
                minZoom: 0,
                maxBounds: [
                    [-90, -175],
                    [84, 195],
                ],
                maxBoundsViscosity: 1.0,
                iconSize: [80, 69],
                useCluster: true,
                worldCopyJump: true,
            },
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
            if (this.$refs && this.$refs.map) this.$refs.map.centerMap()
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

    .leaflet-map {
        transition: filter 1s ease;
        overflow: hidden;
    }

    .leaflet-map.loading {
        filter: blur(4px);
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
