import { Icon } from 'leaflet'

export default function fixLeaflet() {
  // Resolves an issue where the markers would not appear
  // @ts-expect-error error typing
  delete Icon.Default.prototype._getIconUrl
  Icon.Default.mergeOptions({
    iconRetinaUrl: 'leaflet/dist/images/marker-icon-2x.png',
    iconUrl: 'leaflet/dist/images/marker-icon.png',
    shadowUrl: 'leaflet/dist/images/marker-shadow.png',
  })
}
