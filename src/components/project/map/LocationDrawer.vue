<template>
    <div v-if="!!projectId">
        <BaseDrawer
            no-footer
            :is-opened="isOpened"
            :title="$t('project.edit-map')"
            @close="$emit('close')"
            @confirm="$emit('close')"
            :confirm-action-name="$t('common.save')"
        >
            <div class="top">
                <LpiSnackbar icon="QuestionMark" type="info">
                    <ol>
                        <li>{{ $t('project.map-hint-1') }}</li>
                        <li>{{ $t('project.map-hint-2') }}</li>
                        <li>{{ $t('project.map-hint-3') }}</li>
                    </ol>
                </LpiSnackbar>
            </div>

            <div class="full-screen-map-ctn project-map-ctn">
                <div class="map-inner-ctn">
                    <div class="map">
                        <LazyBaseMap
                            ref="map"
                            :key="mapkey"
                            :config="config"
                            v-if="isOpened"
                            @contextmenu="
                                $event?.isEdit
                                    ? openEditModal($event.location)
                                    : openAddModal($event)
                            "
                        >
                            <template #default="slotProps">
                                <template v-if="slotProps.map">
                                    <MapPointer
                                        v-for="location in locations"
                                        :key="location.id"
                                        @mounted="
                                            slotProps.addPointer($event, {
                                                contextmenu: () => openEditModal(location),
                                            })
                                        "
                                        @unmounted="slotProps.removePointer(location)"
                                        :location="location"
                                        :has-location-tip="
                                            location.title.length > 0 ||
                                            location.description.length > 0
                                        "
                                    />
                                </template>
                            </template>
                        </LazyBaseMap>
                    </div>
                </div>
            </div>
        </BaseDrawer>

        <LocationForm
            v-if="formVisible"
            :project-id="projectId"
            :location-to-be-edited="locationToBeEdited"
            :new-coordinates="newCoordinates"
            @close="formVisible = false"
            @center-map="centerMap"
            @location-edited="$emit('reload-locations')"
            @location-created="$emit('reload-locations')"
            @location-deleted="$emit('reload-locations')"
        />
    </div>
</template>

<script>
import BaseDrawer from '@/components/base/BaseDrawer.vue'
import LpiSnackbar from '@/components/base/LpiSnackbar.vue'
import MapPointer from '@/components/map/MapPointer.vue'
import LocationForm from '@/components/project/map/LocationForm.vue'
//import LocationTooltip from '@/components/map/LocationTooltip.vue'
import imageMixin from '@/mixins/imageMixin.ts'
import { LazyBaseMap } from '#components'
import permissions from '@/mixins/permissions.ts'

export default {
    name: 'LocationDrawer',

    emits: ['close', 'reload-locations'],

    mixins: [imageMixin, permissions],

    components: {
        BaseDrawer,
        LpiSnackbar,
        LocationForm,
        MapPointer,
        //LocationTooltip,
        LazyBaseMap,
    },

    props: {
        isOpened: {
            type: Boolean,
            default: false,
        },

        projectId: {
            type: [String || number || null],
            default: null,
        },

        locations: {
            type: Array,
            default: () => [],
        },
    },

    data() {
        return {
            mapkey: 0,
            config: {
                mapUrl: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
                zoom: 2,
                maxZoom: 18,
                minZoom: 2,
                maxBounds: [
                    [-90, -175],
                    [84, 195],
                ],
                maxBoundsViscosity: 1.0,
                iconSize: [80, 69],
                worldCopyJump: true,
            },
            formVisible: false,
            locationToBeEdited: null,
            newCoordinates: [],
            mapVisible: true,
        }
    },
    watch: {
        locations() {
            this.mapkey++
        },
    },

    methods: {
        centerMap() {
            if (this.$refs.map) this.$refs.map.centerMap()
        },

        openEditModal(location) {
            if (this.canEditProject) {
                // restart from source locations because the map ones are not reactive
                this.locationToBeEdited = this.locations.find((loc) => loc.id === location.id)
                this.formVisible = true
            }
        },

        openAddModal(event) {
            if (this.canEditProject) {
                this.locationToBeEdited = null
                this.newCoordinates = [event.latlng.lat, event.latlng.lng]
                this.formVisible = true
            }
        },
    },
}
</script>

<style lang="scss" scoped>
.top {
    display: flex;
    align-items: center;
    justify-content: space-around;
    margin-bottom: $space-l;
}

.project-map-ctn {
    height: 500px;
    border-radius: $border-radius-l;
    overflow: hidden;

    .leaflet-container {
        height: 100%;
    }

    .map-inner-ctn {
        height: 100%;

        .map {
            height: 100%;
        }
    }

    &.full-screen-map-ctn {
        height: 74vh;
    }
}

:deep(.leaflet-div-icon) {
    border: none;
    background: transparent;
}
</style>
