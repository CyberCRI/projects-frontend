import { IconImageChoice, ICONS } from '@/functs/IconImage'
import { LocationType } from '@/models/types'

export const IconMapLocationType = (locationType: LocationType): IconImageChoice => {
  switch (locationType) {
    case 'impact':
      return 'Sun'
    case 'team':
      return 'Users'
    case 'address':
      return 'Home'
    case 'news':
      return 'NewsLine'
    case 'event':
      return 'Calendar'
    default:
      return 'Alert'
  }
}

export const createClusterIcons = (cluster) => {
  const { t } = useNuxtI18n()

  const markers = cluster.getAllChildMarkers()

  const counterLocationType: { [key in LocationType]?: number } = {}

  markers.forEach((m) => {
    const locationType = m.options.location.type
    counterLocationType[locationType] ??= 0
    counterLocationType[locationType] += 1
  })

  const clusterMarker = document.createElement('div')
  clusterMarker.className = 'cluster-container shadowed-box'

  Object.entries(counterLocationType).forEach(([LocationType, count]) => {
    const container = document.createElement('div')
    container.className = `cluster-element ${LocationType}`
    container.title = t(`location.${LocationType}`)
    const icon = ICONS[IconMapLocationType(LocationType as LocationType)]
    container.innerHTML = `
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="location-icon">${icon}</svg>
      <span>${count}</span>
    `
    clusterMarker.appendChild(container)
  })

  const clusterMarkerString = `${clusterMarker.outerHTML}<div class="marker-line" />`

  return L.divIcon({
    html: clusterMarkerString,
    className: 'cluster-parent',
    iconSize: null,
  })
}
