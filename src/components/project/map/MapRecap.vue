<template>
    <div class="map-recap">
        <div class="map-inner-ctn">
            <div class="map">
                <BaseMap ref="summary-map" :config="config" :use-cluster="true">
                    <template #default="slotProps">
                        <template v-if="slotProps.map">
                            <MapPointer
                                v-for="location in locations"
                                :key="location.id"
                                :location="location"
                                @mounted="slotProps.addPointer"
                                @unmounted="slotProps.removePointer(location)"
                            />
                        </template>
                    </template>
                </BaseMap>
            </div>
        </div>

        <ContextActionButton
            :secondary="true"
            class="map-button"
            action-icon="Expand"
            @click="projectLayoutToggleAddModal('location')"
        />
    </div>
</template>

<script>
import ContextActionButton from '@/components/base/button/ContextActionButton.vue'
import imageMixin from '@/mixins/imageMixin.ts'
import MapPointer from '@/components/map/MapPointer.vue'
import BaseMap from '@/components/map/BaseMap.vue'

export default {
    name: 'MapRecap',

    mixins: [imageMixin],

    inject: ['projectLayoutToggleAddModal'],

    components: {
        ContextActionButton,
        MapPointer,
        BaseMap,
    },

    props: {
        locations: {
            type: Array,
            default: () => [],
        },
    },

    data() {
        return {
            config: {
                mapUrl: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
                zoom: 5,
                maxZoom: 17,
                minZoom: 2,
                maxBounds: [
                    [-90, -175],
                    [84, 195],
                ],

                iconSize: [80, 69],
                maxBoundsViscosity: 1,
                worldCopyJump: true,
            },
        }
    },

    watch: {
        locations: {
            handler() {
                if (this.$refs['summary-map']) this.$refs['summary-map'].centerMap()
            },
            deep: true,
        },
    },
}
</script>

<style lang="scss">
@import '@/design/scss/map';
</style>

<style lang="scss" scoped>
.map-recap {
    height: 350px;
    overflow: hidden;
    border-radius: $border-radius-l;
    position: relative;

    .leaflet-container {
        height: 100%;
    }

    .map-inner-ctn {
        width: 100%;
        height: 100%;
        position: relative;

        .vue2leaflet-map,
        .leaflet-interactive {
            cursor: auto !important;
            pointer-events: none;
        }

        .map {
            overflow: hidden;
            height: 100%;
            width: 100%;
            position: absolute;
            top: 0;
            z-index: 0;

            .leaflet-marker-icon {
                display: flex;
                align-items: center;
                justify-content: center;

                .pin-icon {
                    height: 20px;
                    fill: $primary-dark;
                }
            }
        }

        .leaflet-control-zoom {
            display: none !important;
        }
    }

    .leaflet-map.loading {
        filter: blur(4px);
    }

    .map-button {
        position: absolute;
        top: 14px;
        right: 12px;
        background: $white;
        border: $border-width-s solid $primary-dark;
    }
}
</style>
