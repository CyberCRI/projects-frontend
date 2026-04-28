import { lpiMount } from '~~/tests/helpers/LpiMount'
import MapPointer from '~/components/map/MapPointer.vue'

import { describe, expect, it } from 'vitest'
import { ProjectFactory } from '../../../factories/project.factory'
import LocationFactory from '../../../factories/location.factory'

describe('MapPointer.vue', () => {
  const project = ProjectFactory.generate()

  it('should render component', () => {
    const wrapper = lpiMount(MapPointer, {
      props: { project, isExpanded: false, location: LocationFactory.generate({ type: 'impact' }) },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('should display impact badge', () => {
    const wrapper = lpiMount(MapPointer, {
      props: { project, isExpanded: false, location: LocationFactory.generate({ type: 'impact' }) },
    })
    const badgeLabel = wrapper.find('.badge .impact')

    expect(badgeLabel.text()).toBe('Impact')
  })

  it('should display team badge', () => {
    const wrapper = lpiMount(MapPointer, {
      props: { project, isExpanded: false, location: LocationFactory.generate({ type: 'team' }) },
    })
    const badgeLabel = wrapper.find('.badge .team')

    expect(badgeLabel.text()).toBe('Team')
  })
})
