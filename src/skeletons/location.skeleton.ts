import { BaseLocationModel } from '~/models/location.model'

export const locationSkeleton = (
  def?: Partial<BaseLocationModel>
): Omit<BaseLocationModel, 'id'> => ({
  lat: 71.17095952412656,
  lng: 25.783303884932977,
  type: 'address',
  title: 'title',
  description: 'Ipsum nostrud officia dolor esse exercitation mollit',
  ...(def || {}),
})
