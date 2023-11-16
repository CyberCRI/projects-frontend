<template>
    <div class="map">
        <div class="hidden">
            <slot :add-pointer="addPointer" :remove-pointer="removePointer" :map="map"></slot>
        </div>
    </div>
</template>
<script>
import * as L from 'leaflet'
import 'leaflet.markercluster/dist/leaflet.markercluster.js'
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import { toRaw } from 'vue'

export default {
    name: 'BaseMap',

    emits: ['contextmenu'],

    props: {
        config: {
            type: Object,
            default: () => {},
        },
        useCluster: {
            type: Boolean,
            default: false,
        },
    },

    data() {
        return {
            map: null,
            markerCluster: null,

            markers: new Map(),
        }
    },

    mounted() {
        const map = L.map(this.$el, {
            center: [0, 0],
            zoom: this.config.zoom,
            maxZoom: this.config.maxZoom,
            minZoom: this.config.minZoom,
            maxBounds: this.config.maxBounds,
            maxBoundsViscosity: this.config.maxBoundsViscosity,
            worldCopyJump: this.config.worldCopyJump,
        })

        if (this.useCluster) {
            const markerCluster = L.markerClusterGroup({
                removeOutsideVisibleBounds: true,
                chunkedLoading: true,
                iconCreateFunction: this.createClusterIcons,
            })

            map.addLayer(markerCluster)
            this.markerCluster = markerCluster
        }

        map.on('contextmenu', (e) => this.$emit('contextmenu', e))
        L.tileLayer(this.config.mapUrl, {
            attribution:
                '<a href="https://carto.com/basemaps/">Basemaps</a> | &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
        }).addTo(map)

        this.$nextTick(this.centerMap)
        this.map = map
    },

    computed: {
        iconAnchor() {
            return this.config.iconSize
                ? [this.config.iconSize[0] / 2, this.config.iconSize[1]]
                : null
        },
    },
    methods: {
        addPointer({ markerContent, location, tooltip }, eventHandlers) {
            const icon = L.divIcon({
                html: markerContent,
                className: location.type,
                iconSize: this.config.iconSize,
                iconAnchor: this.iconAnchor,
            })

            const marker = L.marker([location.lat, location.lng], { icon })
            if (tooltip) marker.bindPopup(tooltip.$el)
            if (eventHandlers) {
                for (const entry of Object.entries(eventHandlers)) {
                    marker.on(entry[0], entry[1])
                }
            }

            this.markers.set(toRaw(location), marker)

            if (this.markerCluster) toRaw(this.markerCluster).addLayers(marker)
            else marker.addTo(toRaw(this.map))

            if (this.markerCluster) this.markerCluster.refreshClusters()
        },

        removePointer(location) {
            toRaw(this.markers.get(toRaw(location)))?.removeFrom(
                toRaw(this.markerCluster ? this.markerCluster : this.map)
            )
            this.markers.delete(toRaw(location))
            if (this.markerCluster) this.markerCluster.refreshClusters()
        },

        createClusterIcons(cluster) {
            const markers = cluster.getAllChildMarkers()

            const teamCluster = []
            const impactCluster = []

            markers.forEach((m) => {
                const className = m.getIcon().options.className
                if (className === 'team') teamCluster.push(className)
                else if (className === 'impact') impactCluster.push(impactCluster)
            })

            const clusterMarker = document.createElement('div')
            clusterMarker.className = 'cluster-ctn'
            let teamHTML, impactHtml

            if (teamCluster.length) {
                teamHTML = document.createElement('div')
                teamHTML.className = 'team marker-ctn'
                teamHTML.appendChild(document.createTextNode('' + teamCluster.length))
                clusterMarker.appendChild(teamHTML)
            }
            if (impactCluster.length) {
                impactHtml = document.createElement('div')
                impactHtml.className = 'impact marker-ctn'
                impactHtml.appendChild(document.createTextNode('' + impactCluster.length))
                clusterMarker.appendChild(impactHtml)
            }

            let clusterMarkerString = clusterMarker.outerHTML
            clusterMarkerString += '<span class="line" />'

            const sizeClass = (cluster.getChildCount() + '').length
            return L.divIcon({
                html: clusterMarkerString,
                className: 'marker-cluster team size-' + sizeClass,
                iconSize: null,
            })
        },

        centerMap() {
            this.$nextTick(() => {
                if (!this.$el) {
                    return // fix error if quiting the map before it's loaded
                }

                const bounds = []
                this.markers.forEach((m) => {
                    bounds.push([m.getLatLng().lat, m.getLatLng().lng])
                })
                // Make sure to "unproxy" the map before using it with Leaflet
                if (bounds.length) toRaw(this.map).fitBounds(bounds, { maxZoom: 5 })
                this.loading = false
            })
        },
    },
}
</script>
<style lang="scss" scoped>
.map {
    height: 100%;
}
</style>
