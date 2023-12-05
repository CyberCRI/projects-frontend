<template>
    <div>
        <DrawerLayout
            :has-footer="false"
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
                        <BaseMap
                            ref="map"
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
                        </BaseMap>
                    </div>
                </div>
            </div>
        </DrawerLayout>

        <LocationForm
            v-if="formVisible"
            :location-to-be-edited="locationToBeEdited"
            :new-coordinates="newCoordinates"
            @close="formVisible = false"
            @center-map="centerMap"
        />
    </div>
</template>

<script>
import DrawerLayout from '@/components/lpikit/Drawer/DrawerLayout.vue'
import LpiSnackbar from '@/components/lpikit/Snackbar/LpiSnackbar.vue'
import MapPointer from '@/components/lpikit/Map/MapPointer.vue'
import LocationForm from './LocationForm.vue'
//import LocationTooltip from '@/components/lpikit/Map/LocationTooltip.vue'
import imageMixin from '@/mixins/imageMixin.ts'
import BaseMap from '@/components/lpikit/Map/BaseMap.vue'
import permissions from '@/mixins/permissions.ts'

export default {
    name: 'LocationDrawer',

    emits: ['close'],

    mixins: [imageMixin, permissions],

    components: {
        DrawerLayout,
        LpiSnackbar,
        LocationForm,
        MapPointer,
        //LocationTooltip,
        BaseMap,
    },

    props: {
        isOpened: {
            type: Boolean,
            default: false,
        },
    },

    data() {
        return {
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

    computed: {
        project() {
            return this.$store.getters['projects/project']
        },

        locations() {
            return this.project ? this.project.locations : []
        },
    },

    methods: {
        centerMap() {
            if (this.$refs.map) this.$refs.map.centerMap()
        },

        openEditModal(location) {
            if (this.canEditProject) {
                this.locationToBeEdited = location
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
