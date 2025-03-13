import analytics from '@/analytics/index'
import { LocationType } from '@/models/types'

export interface LocationAnalytic {
    project: {
        id: string
    }
    location: {
        lat: number
        lng: number
        type: LocationType
    }
}

export default {
    /**
     * "Add team/impact point" analytic event
     * @param location
     */
    addLocationMapPoint(location: LocationAnalytic): void {
        const eventName = location.location.type === 'team' ? 'add_team_point' : 'add_impact_point'
        analytics.track(eventName, location)
    },
    /**
     * "update team/impact point" analytic event
     */
    updateLocationMapPoint(location: LocationAnalytic): void {
        const eventName =
            location.location.type === 'team' ? 'update_team_point' : 'update_impact_point'
        analytics.track(eventName, location)
    },
    /**
     * "Delete team/impact point" analytic event
     * @param location
     */
    deleteLocationMapPoint(location: LocationAnalytic): void {
        const eventName =
            location.location.type === 'team' ? 'delete_team_point' : 'delete_impact_point'
        analytics.track(eventName, location)
    },
}
