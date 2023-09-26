import * as L from 'leaflet'
import 'leaflet.markercluster/dist/leaflet.markercluster.js'
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import { toRaw } from 'vue'

export default {
    data() {
        return {
            map: null,
            markerCluster: null,
        }
    },

    computed: {
        iconAnchor() {
            return this.config.iconSize
                ? [this.config.iconSize[0] / 2, this.config.iconSize[1]]
                : null
        },
    },
    methods: {
        setupMap(ref, config, store) {
            const vm = this
            if (config.useCluster) {
                L.Map.addInitHook(function () {
                    vm.markerCluster = L.markerClusterGroup({
                        removeOutsideVisibleBounds: true,
                        chunkedLoading: true,
                        iconCreateFunction: vm.createClusterIcons,
                    }).addTo(this)
                })
            }
            const map = L.map(ref, {
                center: [0, 0],
                zoom: config.zoom,
                maxZoom: config.maxZoom,
                minZoom: config.minZoom,
                maxBounds: config.maxBounds,
                maxBoundsViscosity: config.maxBoundsViscosity,
                worldCopyJump: config.worldCopyJump,
            })
            L.tileLayer(config.mapUrl, {
                attribution: store.state.maps.attribution,
            }).addTo(map)

            if (this.centerMap) {
                this.$nextTick(this.centerMap)
            }
            this.map = map
        },

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
            if (this.markerCluster) toRaw(this.markerCluster).addLayers(marker)
            else marker.addTo(toRaw(this.map))
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
    },
}
